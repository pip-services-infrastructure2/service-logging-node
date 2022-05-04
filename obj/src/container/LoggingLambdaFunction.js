"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.LoggingLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("logging", "Trace logging function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-logging', 'controller', 'default', '*', '*'));
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory());
    }
}
exports.LoggingLambdaFunction = LoggingLambdaFunction;
exports.handler = new LoggingLambdaFunction().getHandler();
//# sourceMappingURL=LoggingLambdaFunction.js.map