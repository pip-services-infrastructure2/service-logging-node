import { LoggingMongoDbPersistence } from './LoggingMongoDbPersistence';

export class LoggingMessagesMongoDbPersistence extends LoggingMongoDbPersistence {

    public _collection: string = 'messages';

    constructor() {
        super('messages');
    }
}