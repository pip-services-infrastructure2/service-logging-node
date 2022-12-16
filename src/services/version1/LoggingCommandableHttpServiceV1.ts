import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class LoggingCommandableHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/logging');
        this._dependencyResolver.put('controller', new Descriptor('service-logging', 'controller', 'default', '*', '1.0'));
    }
}