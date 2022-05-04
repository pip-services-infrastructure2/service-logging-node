import { LoggingMongoDbPersistence } from './LoggingMongoDbPersistence';

export class LoggingErrorsMongoDbPersistence extends LoggingMongoDbPersistence {

    public _collection: string = 'errors';

    constructor() {
        super('errors');
    }
}