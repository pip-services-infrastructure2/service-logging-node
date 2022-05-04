import { DataPage } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ICleanable } from 'pip-services3-commons-nodex';

import { LogMessageV1 } from '../data/version1/LogMessageV1';

export interface ILoggingPersistence extends ICleanable {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>>;

    addOne(correlationId: string, message: LogMessageV1): Promise<LogMessageV1>;

    addBatch(correlationId: string, messages: LogMessageV1[]): Promise<void>;

    clear(correlationId: string): Promise<void>;

    deleteExpired(correlationId: string, expireTime: Date): Promise<void>;
}
