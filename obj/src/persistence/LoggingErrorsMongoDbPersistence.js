"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingErrorsMongoDbPersistence = void 0;
const LoggingMongoDbPersistence_1 = require("./LoggingMongoDbPersistence");
class LoggingErrorsMongoDbPersistence extends LoggingMongoDbPersistence_1.LoggingMongoDbPersistence {
    constructor() {
        super('errors');
        this._collection = 'errors';
    }
}
exports.LoggingErrorsMongoDbPersistence = LoggingErrorsMongoDbPersistence;
//# sourceMappingURL=LoggingErrorsMongoDbPersistence.js.map