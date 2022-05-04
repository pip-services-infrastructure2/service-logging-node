"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class LoggingMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor(collection) {
        super(collection);
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
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
        let errorLevel = pip_services3_components_nodex_1.LogLevel.Error;
        if (errorsOnly)
            criteria.push({ level: errorLevel });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    deleteByFilter(correlationId, filter) {
        const _super = Object.create(null, {
            deleteByFilter: { get: () => super.deleteByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.deleteByFilter.call(this, correlationId, this.composeFilter(filter));
        });
    }
    addOne(correlationId, message) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.create.call(this, correlationId, message);
        });
    }
    addBatch(correlationId, messages) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    deleteExpired(correlationId, expireTime) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteByFilter(correlationId, pip_services3_commons_nodex_1.FilterParams.fromTuples("to_time", expireTime));
        });
    }
}
exports.LoggingMongoDbPersistence = LoggingMongoDbPersistence;
//# sourceMappingURL=LoggingMongoDbPersistence.js.map