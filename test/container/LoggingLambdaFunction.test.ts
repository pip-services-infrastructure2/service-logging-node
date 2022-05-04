const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';
import { ErrorDescriptionFactory } from 'pip-services3-commons-nodex';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../src/logic/LoggingController';
import { LoggingLambdaFunction } from '../../src/container/LoggingLambdaFunction';


suite('LoggingLambdaFunction', ()=> {
    let lambda: LoggingLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'service-logging:persistence-messages:memory:default:1.0',
            'persistence.descriptor', 'service-logging:persistence-errors:memory:default:1.0',
            'controller.descriptor', 'service-logging:controller:default:default:1.0'
        );

        lambda = new LoggingLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    
    test('CRUD Operations', async () => {
        let message = await lambda.act(
            {
                role: 'logging',
                cmd: 'write_message',
                message: new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
            }
        );
        assert.isObject(message);

        let message1 = new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB");
        let message2 = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
        message2.time = new Date(1975, 1, 1, 0, 0, 0, 0);

        await lambda.act(
            {
                role: 'logging',
                cmd: 'write_messages',
                messages: [message1, message2]
            }
        )

        let page = await lambda.act(
            {
                role: 'logging',
                cmd: 'read_messages',
                filter: FilterParams.fromTuples("search", "AA")
            }
        );

        assert.lengthOf(page.data, 2);

        page = await lambda.act(
            {
                role: 'logging',
                cmd: 'read_errors'
            }
        );

        assert.lengthOf(page.data, 1);
    });
});