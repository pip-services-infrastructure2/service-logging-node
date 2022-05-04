"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const LoggingMemoryPersistence_1 = require("../persistence/LoggingMemoryPersistence");
const LoggingMessagesMongoDbPersistence_1 = require("../persistence/LoggingMessagesMongoDbPersistence");
const LoggingErrorsMongoDbPersistence_1 = require("../persistence/LoggingErrorsMongoDbPersistence");
const LoggingController_1 = require("../logic/LoggingController");
const LoggingHttpServiceV1_1 = require("../services/version1/LoggingHttpServiceV1");
class LoggingServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor, LoggingMessagesMongoDbPersistence_1.LoggingMessagesMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor, LoggingErrorsMongoDbPersistence_1.LoggingErrorsMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController_1.LoggingController);
        this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1_1.LoggingHttpServiceV1);
    }
}
exports.LoggingServiceFactory = LoggingServiceFactory;
LoggingServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "factory", "default", "default", "1.0");
LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "persistence-messages", "memory", "*", "1.0");
LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "persistence-errors", "memory", "*", "1.0");
LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "persistence-messages", "mongodb", "*", "1.0");
LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "persistence-errors", "mongodb", "*", "1.0");
LoggingServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "controller", "default", "*", "1.0");
LoggingServiceFactory.HttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-logging", "service", "http", "*", "1.0");
//# sourceMappingURL=LoggingServiceFactory.js.map