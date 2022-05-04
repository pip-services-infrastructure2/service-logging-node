import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';

export abstract class LoggingMongoDbPersistence extends IdentifiableMongoDbPersistence<LogMessageV1, string> implements ILoggingPersistence {

    constructor(collection?: string) {
        super(collection);

        this._maxPageSize = 1000;
    }

    protected composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString("search");
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];

            searchCriteria.push({ message: { $regex: searchRegex } });
            searchCriteria.push({ correlation_id: { $regex: searchRegex } });

            searchCriteria.push({ "error.message": { $regex: searchRegex } });
            searchCriteria.push({ "error.stack_trace": { $regex: searchRegex } });
            searchCriteria.push({ "error.code": { $regex: searchRegex } });

            criteria.push({ $or: searchCriteria });
        }

        let level = filter.getAsNullableInteger("level");
        if (level != null)
            criteria.push({ level: level });

        let maxLevel = filter.getAsNullableInteger("max_level");
        if (maxLevel != null)
            criteria.push({ level: { $lte: maxLevel } });

        let fromTime = filter.getAsNullableDateTime("from_time");
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime("to_time");
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });

        let source = filter.getAsNullableString("source");
        if (source != null)
            criteria.push({ source: source });

        let errorsOnly = filter.getAsBooleanWithDefault("errors_only", false);
        let errorLevel = LogLevel.Error
        if (errorsOnly)
            criteria.push({ level: errorLevel });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
    }

    public async deleteByFilter(correlationId: string, filter: FilterParams): Promise<void> {
        return await super.deleteByFilter(correlationId, this.composeFilter(filter));
    }

    public async addOne(correlationId: string, message: LogMessageV1): Promise<LogMessageV1> {
        return await super.create(correlationId, message);
    }

    public async addBatch(correlationId: string, messages: LogMessageV1[]): Promise<void> {
        if (messages == null || messages.length == 0) {
            return;
        }

        let batch = this._collection.collection.initializeUnorderedBulkOp();
        //batch can be undefined if try to write log before connected to mongodb

        for (let item of messages) {
            if (batch)
                batch.insert({
                    _id: item.id,
                    time: item.time,
                    source: item.source,
                    level: item.level,
                    correlation_id: item.correlation_id,
                    error: item.error,
                    message: item.message
                });
        }

        if (batch)
            batch.execute((err) => {
                if (!err)
                    this._logger.trace(correlationId, "Created %d data in %s", messages.length, this._collection);
            });
    }

    public async deleteExpired(correlationId: string, expireTime: Date): Promise<void> {        
        await this.deleteByFilter(correlationId, FilterParams.fromTuples("to_time", expireTime));
    }

}