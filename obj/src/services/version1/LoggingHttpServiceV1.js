"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class LoggingHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/logging');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-logging', 'controller', 'default', '*', '1.0'));
    }
}
exports.LoggingHttpServiceV1 = LoggingHttpServiceV1;
//# sourceMappingURL=LoggingHttpServiceV1.js.map