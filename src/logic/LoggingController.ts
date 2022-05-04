import { ConfigParams, IOpenable, IdGenerator } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { LogLevel } from 'pip-services3-components-nodex';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from '../persistence/ILoggingPersistence';
import { ILoggingController } from './ILoggingController';
import { LoggingCommandSet } from './LoggingCommandSet';

export class LoggingController
    implements ILoggingController, ICommandable, IConfigurable, IReferenceable, IOpenable {

    private _dependencyResolver: DependencyResolver;
    private _messagesPersistence: ILoggingPersistence;
    private _errorsPersistence: ILoggingPersistence;
    private _commandSet: LoggingCommandSet;
    private _expireCleanupTimeout: number = 60; // 60 min
    private _expireLogsTimeout: number = 3; // 3 days
    private _expireErrorsTimeout: number = 30; // 30 days
    private _interval: any = null;

    constructor() {
        this._dependencyResolver = new DependencyResolver();
        this._dependencyResolver.put('messages_persistence', new Descriptor('service-logging', 'persistence-messages', '*', '*', '*'));
        this._dependencyResolver.put('errors_persistence', new Descriptor('service-logging', 'persistence-errors', '*', '*', '*'));
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options.expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options.expire_errors_timeout', this._expireErrorsTimeout);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._messagesPersistence = this._dependencyResolver.getOneRequired<ILoggingPersistence>('messages_persistence');
        this._errorsPersistence = this._dependencyResolver.getOneRequired<ILoggingPersistence>('errors_persistence');
    }

    public isOpen(): boolean {
        return this._interval != null;
    }

    public async open(correlationId: string): Promise<void> {
        if (this._interval != null) {
            clearInterval(this._interval);
        }

        this._interval = setInterval(() => {
            this.deleteExpired(correlationId);
        }, 1000 * 60 * this._expireCleanupTimeout);
    }

    public async close(correlationId: string): Promise<void> {
        if (this._interval != null) {
            clearTimeout(this._interval);
            this._interval = null;
        }
    }

    public async writeMessage(correlationId: string, message: LogMessageV1): Promise<LogMessageV1> {

        message.id = IdGenerator.nextLong();
        message.level = message.level || LogLevel.Trace;
        message.time = message.time || new Date();

        let result = await this._messagesPersistence.addOne(correlationId, message);

        if (message.level <= LogLevel.Error)
            await this._errorsPersistence.addOne(correlationId, message);

        return result;
    }

    public async writeMessages(correlationId: string, messages: LogMessageV1[]): Promise<void> {

        if (messages == null || messages.length == 0) {
            return;
        }

        let errors: LogMessageV1[] = [];

        for(let message of messages) {
            message.id = IdGenerator.nextLong();
            message.level = message.level || LogLevel.Trace;
            message.time = message.time || new Date();

            if (message.level <= LogLevel.Error) {
                errors.push(message);
            }
        }

        await Promise.all([
            this._messagesPersistence.addBatch(correlationId, messages),
            errors.length > 0 ? this._errorsPersistence.addBatch(correlationId, errors): null
        ]);
    }

    public async readMessages(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>> {
        return await this._messagesPersistence.getPageByFilter(correlationId, filter, paging);
    }

    public async readErrors(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LogMessageV1>> {
        return await this._errorsPersistence.getPageByFilter(correlationId, filter, paging);
    }

    public async clear(correlationId: string): Promise<void> {
        return await this._messagesPersistence.clear(correlationId);
    }

    public async deleteExpired(correlationId: string): Promise<void> {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);

        await this._messagesPersistence.deleteExpired(correlationId, expireLogsTime);
        await this._errorsPersistence.deleteExpired(correlationId, expireErrorsTime);
    }
}