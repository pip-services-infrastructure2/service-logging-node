"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory);
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory);
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory);
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map