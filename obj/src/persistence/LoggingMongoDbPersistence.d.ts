import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
export declare abstract class LoggingMongoDbPersistence extends IdentifiableMongoDbPersistence<LogMessageV1, string> implements ILoggingPersistence {
    constructor(collection?: string);
    protected composeFilter(filter: any): {
        $and: any[];
    };
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>>;
    deleteByFilter(correlationId: string, filter: FilterParams): Promise<void>;
    addOne(correlationId: string, message: LogMessageV1): Promise<LogMessageV1>;
    addBatch(correlationId: string, messages: LogMessageV1[]): Promise<void>;
    deleteExpired(correlationId: string, expireTime: Date): Promise<void>;
}
