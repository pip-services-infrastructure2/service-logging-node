import { ProcessContainer } from 'pip-services3-container-nodex';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { LoggingServiceFactory } from '../build/LoggingServiceFactory';

export class LoggingProcess extends ProcessContainer {

    public constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory);
        this._factories.add(new DefaultRpcFactory);
        this._factories.add(new DefaultSwaggerFactory);
    }

}
