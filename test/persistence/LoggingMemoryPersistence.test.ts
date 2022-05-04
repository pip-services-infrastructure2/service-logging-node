import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingPersistenceFixture } from './LoggingPersistenceFixture';

suite('LoggingMemoryPersistence', ()=> {
    let persistence: LoggingMemoryPersistence;
    let fixture: LoggingPersistenceFixture;

    suiteSetup(async () => {
        persistence = new LoggingMemoryPersistence();
        fixture = new LoggingPersistenceFixture(persistence);
    });
    
    setup(async () => {
        await persistence.clear(null);
    });

    test('Read and Write', async () => {
        await fixture.testReadWrite();
    });

    test('Search', async () => {
        await fixture.testSearch();
    });
});