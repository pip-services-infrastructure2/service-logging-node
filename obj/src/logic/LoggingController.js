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
exports.LoggingController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const LoggingCommandSet_1 = require("./LoggingCommandSet");
class LoggingController {
    constructor() {
        this._expireCleanupTimeout = 60; // 60 min
        this._expireLogsTimeout = 3; // 3 days
        this._expireErrorsTimeout = 30; // 30 days
        this._interval = null;
        this._dependencyResolver = new pip_services3_commons_nodex_3.DependencyResolver();
        this._dependencyResolver.put('messages_persistence', new pip_services3_commons_nodex_2.Descriptor('service-logging', 'persistence-messages', '*', '*', '*'));
        this._dependencyResolver.put('errors_persistence', new pip_services3_commons_nodex_2.Descriptor('service-logging', 'persistence-errors', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet_1.LoggingCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options.expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options.expire_errors_timeout', this._expireErrorsTimeout);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._messagesPersistence = this._dependencyResolver.getOneRequired('messages_persistence');
        this._errorsPersistence = this._dependencyResolver.getOneRequired('errors_persistence');
    }
    isOpen() {
        return this._interval != null;
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._interval != null) {
                clearInterval(this._interval);
            }
            this._interval = setInterval(() => {
                this.deleteExpired(correlationId);
            }, 1000 * 60 * this._expireCleanupTimeout);
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._interval != null) {
                clearTimeout(this._interval);
                this._interval = null;
            }
        });
    }
    writeMessage(correlationId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            message.id = pip_services3_commons_nodex_1.IdGenerator.nextLong();
            message.level = message.level || pip_services3_components_nodex_1.LogLevel.Trace;
            message.time = message.time || new Date();
            let result = yield this._messagesPersistence.addOne(correlationId, message);
            if (message.level <= pip_services3_components_nodex_1.LogLevel.Error)
                yield this._errorsPersistence.addOne(correlationId, message);
            return result;
        });
    }
    writeMessages(correlationId, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (messages == null || messages.length == 0) {
                return;
            }
            let errors = [];
            for (let message of messages) {
                message.id = pip_services3_commons_nodex_1.IdGenerator.nextLong();
                message.level = message.level || pip_services3_components_nodex_1.LogLevel.Trace;
                message.time = message.time || new Date();
                if (message.level <= pip_services3_components_nodex_1.LogLevel.Error) {
                    errors.push(message);
                }
            }
            yield Promise.all([
                this._messagesPersistence.addBatch(correlationId, messages),
                errors.length > 0 ? this._errorsPersistence.addBatch(correlationId, errors) : null
            ]);
        });
    }
    readMessages(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._messagesPersistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    readErrors(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._errorsPersistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    clear(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._messagesPersistence.clear(correlationId);
        });
    }
    deleteExpired(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date().getTime();
            let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
            let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);
            yield this._messagesPersistence.deleteExpired(correlationId, expireLogsTime);
            yield this._errorsPersistence.deleteExpired(correlationId, expireErrorsTime);
        });
    }
}
exports.LoggingController = LoggingController;
//# sourceMappingURL=LoggingController.js.map