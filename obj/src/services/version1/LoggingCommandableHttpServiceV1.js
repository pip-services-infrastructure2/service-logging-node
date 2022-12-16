"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class LoggingCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/logging');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-logging', 'controller', 'default', '*', '1.0'));
    }
}
exports.LoggingCommandableHttpServiceV1 = LoggingCommandableHttpServiceV1;
//# sourceMappingURL=LoggingCommandableHttpServiceV1.js.map