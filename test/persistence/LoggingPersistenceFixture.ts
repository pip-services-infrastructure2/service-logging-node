const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { ErrorDescriptionFactory } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { ILoggingPersistence } from '../../src/persistence/ILoggingPersistence';

export class LoggingPersistenceFixture {
    private _persistence: ILoggingPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public async testCreateMessages() {
        let message = await this._persistence.addOne(
            null,
            new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
        );

        assert.isObject(message);

        message = await this._persistence.addOne(null, new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB"));

        assert.isObject(message);

        message = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
        message.time = new Date(1975, 1, 1, 0, 0, 0, 0);

        message = await this._persistence.addOne(null, message);

        assert.isObject(message);
    }

    public async testReadWrite() {
        let fromTime = new Date();

        await this.testCreateMessages();

        let page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("search", "AA"), null);

        assert.lengthOf(page.data, 2);

        page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("max_level", LogLevel.Info), null);

        assert.lengthOf(page.data, 2);

        page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("from_time", fromTime), null);

        assert.lengthOf(page.data, 2);
    }

    public async testSearch() {
        await this.testCreateMessages();

        let page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("search", "AA"), null);

        assert.lengthOf(page.data, 2);

        page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("search", "23"), null);

        assert.lengthOf(page.data, 3);

        page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("search", "rror"), null);

        assert.lengthOf(page.data, 1);
    }
}
