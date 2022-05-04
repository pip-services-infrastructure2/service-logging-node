import { Benchmark } from 'pip-benchmark-node';
export declare class AddMongoDbLogMessagesBenchmark extends Benchmark {
    private _initialRecordNumber;
    private _sourceQuantity;
    private _startTime;
    private _interval;
    private _source;
    private _time;
    private _messagesPersistence;
    private _errorsPersistence;
    private _controller;
    constructor();
    setUp(): Promise<void>;
    tearDown(): Promise<void>;
    private getRandomString;
    private getRandomLogLevel;
    private getRandomErrorDescriptor;
    execute(): Promise<void>;
}
