"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMessagesMongoDbPersistence = void 0;
const LoggingMongoDbPersistence_1 = require("./LoggingMongoDbPersistence");
class LoggingMessagesMongoDbPersistence extends LoggingMongoDbPersistence_1.LoggingMongoDbPersistence {
    constructor() {
        super('messages');
        this._collection = 'messages';
    }
}
exports.LoggingMessagesMongoDbPersistence = LoggingMessagesMongoDbPersistence;
//# sourceMappingURL=LoggingMessagesMongoDbPersistence.js.map