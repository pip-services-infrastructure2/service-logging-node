import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';
import { LoggingServiceFactory } from '../build/LoggingServiceFactory';

export class LoggingLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("logging", "Trace logging function");
        this._dependencyResolver.put('controller', new Descriptor('service-logging', 'controller', 'default', '*', '*'));
        this._factories.add(new LoggingServiceFactory());
    }
}

export const handler = new LoggingLambdaFunction().getHandler();