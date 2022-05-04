const restify = require('restify');
const assert = require('chai').assert;

import { Descriptor, ErrorDescriptionFactory, FilterParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../src/logic/LoggingController';

suite('LoggingController', ()=> {
    let controller: LoggingController;

    suiteSetup(() => {
        let messagesPersistence = new LoggingMemoryPersistence();
        let errorsPersistence = new LoggingMemoryPersistence();
        controller = new LoggingController();

        let references: References = References.fromTuples(
            new Descriptor('service-logging', 'persistence-messages', 'memory', 'default', '1.0'), messagesPersistence,
            new Descriptor('service-logging', 'persistence-errors', 'memory', 'default', '1.0'), errorsPersistence,
            new Descriptor('service-logging', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup(async () => {
        await controller.clear(null);
    });
    
    test('CRUD Operations', async () => {
        let message = await controller.writeMessage(
            null,
            new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
        );

        assert.isObject(message);

        // let message1 = new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB");
        // let message2 = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
        // message2.time = new Date(1975, 1, 1, 0, 0, 0, 0);

        // assert.isObject(message);

        // await controller.writeMessages(null, [message1, message2]);

        // let page = await  controller.readMessages(null, FilterParams.fromTuples("search", "AA"), null);

        // assert.lengthOf(page.data, 2);

        // page = await controller.readErrors(null, null, null);

        // assert.lengthOf(page.data, 1);
    });
});