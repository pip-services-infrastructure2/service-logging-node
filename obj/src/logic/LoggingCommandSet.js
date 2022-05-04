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
exports.LoggingCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_9 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const LogMessageV1Schema_1 = require("../data/version1/LogMessageV1Schema");
class LoggingCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeReadMessagesCommand());
        this.addCommand(this.makeReadErrorsCommand());
        this.addCommand(this.makeWriteMessageCommand());
        this.addCommand(this.makeWriteMessagesCommand());
        this.addCommand(this.makeClearCommand());
    }
    makeReadMessagesCommand() {
        return new pip_services3_commons_nodex_2.Command("read_messages", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.readMessages(correlationId, filter, paging);
        }));
    }
    makeReadErrorsCommand() {
        return new pip_services3_commons_nodex_2.Command("read_errors", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.readErrors(correlationId, filter, paging);
        }));
    }
    makeWriteMessageCommand() {
        return new pip_services3_commons_nodex_2.Command("write_message", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('message', new LogMessageV1Schema_1.LogMessageV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let message = args.get("message");
            message.level = pip_services3_components_nodex_1.LogLevelConverter.toLogLevel(message.level);
            message.time = pip_services3_commons_nodex_9.DateTimeConverter.toNullableDateTime(message.time);
            return yield this._logic.writeMessage(correlationId, message);
        }));
    }
    makeWriteMessagesCommand() {
        return new pip_services3_commons_nodex_2.Command("write_messages", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('messages', new pip_services3_commons_nodex_6.ArraySchema(new LogMessageV1Schema_1.LogMessageV1Schema())), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let messages = args.get("messages");
            for (let message of messages)
                message.time = pip_services3_commons_nodex_9.DateTimeConverter.toNullableDateTime(message.time);
            return yield this._logic.writeMessages(correlationId, messages);
        }));
    }
    makeClearCommand() {
        return new pip_services3_commons_nodex_2.Command("clear", null, (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._logic.clear(correlationId);
        }));
    }
}
exports.LoggingCommandSet = LoggingCommandSet;
//# sourceMappingURL=LoggingCommandSet.js.map