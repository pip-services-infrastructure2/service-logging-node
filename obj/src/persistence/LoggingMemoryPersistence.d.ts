import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
export declare class LoggingMemoryPersistence implements IConfigurable, ILoggingPersistence {
    private _maxPageSize;
    private _maxTotalSize;
    private _logs;
    constructor();
    configure(config: ConfigParams): void;
    private matchString;
    private messageContains;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>>;
    private truncatelogs;
    private insertMessage;
    addOne(correlationId: string, message: LogMessageV1): Promise<LogMessageV1>;
    addBatch(correlationId: string, data: LogMessageV1[]): Promise<void>;
    clear(correlationId: string): Promise<void>;
    deleteExpired(correlationId: string, expireTime: Date): Promise<void>;
}
