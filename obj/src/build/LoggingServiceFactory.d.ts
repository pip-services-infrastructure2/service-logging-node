import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
export declare class LoggingServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static LoggingMessagesMemoryPersistenceDescriptor: Descriptor;
    static LoggingErrorsMemoryPersistenceDescriptor: Descriptor;
    static LoggingMessagesMongoDbPersistenceDescriptor: Descriptor;
    static LoggingErrorsMongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    constructor();
}
