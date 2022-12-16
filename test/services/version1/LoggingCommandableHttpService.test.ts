const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';
import { ErrorDescriptionFactory } from 'pip-services3-commons-nodex';

import { LogMessageV1 } from '../../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../../src/logic/LoggingController';
import { LoggingCommandableHttpServiceV1 } from '../../../src/services/version1/LoggingCommandableHttpServiceV1';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('LoggingCommandableHttpServiceV1', ()=> {
    let service: LoggingCommandableHttpServiceV1;

    let rest: any;

    suiteSetup(async () => {
        let messagesPersistence = new LoggingMemoryPersistence();
        let errorsPersistence = new LoggingMemoryPersistence();
        let controller = new LoggingController();

        service = new LoggingCommandableHttpServiceV1();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-logging', 'persistence-messages', 'memory', 'default', '1.0'), messagesPersistence,
            new Descriptor('service-logging', 'persistence-errors', 'memory', 'default', '1.0'), errorsPersistence,
            new Descriptor('service-logging', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-logging', 'service', 'commandable-http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', async () => {
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/logging/write_message',
                {
                    message: new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(result);

        let message1 = new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB");
        let message2 = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
        message2.time = new Date(1975, 1, 1, 0, 0, 0, 0);

        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/logging/write_messages',
                {
                    messages: [message1, message2]
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        let page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/logging/read_messages',
                {
                    filter: FilterParams.fromTuples("search", "AA")
                }, 
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.lengthOf(page.data, 2);

        page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/logging/read_errors',
                {}, 
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.lengthOf(page.data, 1);
    });
});