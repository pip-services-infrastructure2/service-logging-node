import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingMessagesMongoDbPersistence} from '../persistence/LoggingMessagesMongoDbPersistence';
import { LoggingErrorsMongoDbPersistence} from '../persistence/LoggingErrorsMongoDbPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingHttpServiceV1 } from '../services/version1/LoggingHttpServiceV1';

export class LoggingServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-logging", "factory", "default", "default", "1.0");
	public static LoggingMessagesMemoryPersistenceDescriptor = new Descriptor("service-logging", "persistence-messages", "memory", "*", "1.0");
	public static LoggingErrorsMemoryPersistenceDescriptor = new Descriptor("service-logging", "persistence-errors", "memory", "*", "1.0");
	public static LoggingMessagesMongoDbPersistenceDescriptor = new Descriptor("service-logging", "persistence-messages", "mongodb", "*", "1.0");
	public static LoggingErrorsMongoDbPersistenceDescriptor = new Descriptor("service-logging", "persistence-errors", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-logging", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-logging", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor, LoggingMessagesMongoDbPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor, LoggingErrorsMongoDbPersistence);
		this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController);
		this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1);
	}
	
}
