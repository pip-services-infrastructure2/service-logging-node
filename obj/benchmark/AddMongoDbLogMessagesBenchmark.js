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
exports.AddMongoDbLogMessagesBenchmark = void 0;
let async = require('async');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const LoggingMessagesMongoDbPersistence_1 = require("../src/persistence/LoggingMessagesMongoDbPersistence");
const LoggingController_1 = require("../src/logic/LoggingController");
class AddMongoDbLogMessagesBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("AddMongoDbLogMessages", "Measures performance of adding LogMessages into MongoDB database");
    }
    setUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
            this._sourceQuantity = this.context.parameters.SourceQuantity.getAsInteger();
            this._startTime = pip_services3_commons_nodex_1.DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
            this._interval = this.context.parameters.Interval.getAsInteger();
            this._time = this._startTime;
            this._source = this.getRandomString(10);
            let mongoUri = this.context.parameters.MongoUri.getAsString();
            let mongoHost = this.context.parameters.MongoHost.getAsString();
            let mongoPort = this.context.parameters.MongoPort.getAsInteger();
            let mongoDb = this.context.parameters.MongoDb.getAsString();
            this._messagesPersistence = new LoggingMessagesMongoDbPersistence_1.LoggingMessagesMongoDbPersistence();
            this._messagesPersistence.configure(pip_services3_commons_nodex_2.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDb));
            this._errorsPersistence = new LoggingMessagesMongoDbPersistence_1.LoggingMessagesMongoDbPersistence();
            this._errorsPersistence.configure(pip_services3_commons_nodex_2.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDb));
            this._controller = new LoggingController_1.LoggingController();
            let references = pip_services3_commons_nodex_4.References.fromTuples(new pip_services3_commons_nodex_3.Descriptor('service-logging', 'persistence-messages', 'mongodb', 'default', '1.0'), this._messagesPersistence, new pip_services3_commons_nodex_3.Descriptor('service-logging', 'persistence-errors', 'mongodb', 'default', '1.0'), this._errorsPersistence, new pip_services3_commons_nodex_3.Descriptor('service-logging', 'controller', 'default', 'default', '1.0'), this._controller);
            this._controller.setReferences(references);
            yield this._messagesPersistence.open(null),
                this.context.sendMessage('Connected to mongodb database collection messages');
            yield this._errorsPersistence.open(null);
            this.context.sendMessage('Connected to mongodb database errors messages');
        });
    }
    tearDown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._messagesPersistence.close(null);
                if (this.context)
                    this.context.sendMessage('Disconnected from mongodb database collection messages');
                yield this._errorsPersistence.close(null);
                if (this.context)
                    this.context.sendMessage('Disconnected from mongodb database collection errors');
            }
            finally {
                this._messagesPersistence = null;
                this._errorsPersistence = null;
                this._controller = null;
            }
        });
    }
    getRandomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
    getRandomLogLevel() {
        return Math.floor(Math.random() * 7);
    }
    getRandomErrorDescriptor() {
        let errorDescription = new pip_services3_commons_nodex_5.ErrorDescription();
        errorDescription.category = this.getRandomString(5);
        errorDescription.type = this.getRandomString(5);
        errorDescription.status = this.getRandomLogLevel();
        errorDescription.code = this.getRandomString(5);
        errorDescription.message = this.getRandomString(5);
        errorDescription.details = this.getRandomString(5);
        errorDescription.correlation_id = this.getRandomString(5);
        errorDescription.cause = this.getRandomString(5);
        errorDescription.stack_trace = this.getRandomString(5);
        return errorDescription;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let LogMessages = [];
            for (let sourceNumber = 1; sourceNumber <= this._sourceQuantity; sourceNumber++) {
                LogMessages.push({
                    id: this.getRandomString(10),
                    time: this._time,
                    source: this.getRandomString(10),
                    level: this.getRandomLogLevel(),
                    correlation_id: this.getRandomString(10),
                    error: this.getRandomErrorDescriptor(),
                    message: this.getRandomString(50)
                });
            }
            this._time = new Date(this._time.getTime() + this._interval);
            yield this._controller.writeMessages(null, LogMessages);
        });
    }
}
exports.AddMongoDbLogMessagesBenchmark = AddMongoDbLogMessagesBenchmark;
//# sourceMappingURL=AddMongoDbLogMessagesBenchmark.js.map