import { BenchmarkRunner } from 'pip-benchmark-node';
import { ConsoleEventPrinter } from 'pip-benchmark-node';
import { MeasurementType } from 'pip-benchmark-node';
import { ExecutionType } from 'pip-benchmark-node';
import { LoggingBenchmarkSuite } from './LogMessageBenchmarkSuite';

let runner = new BenchmarkRunner();

ConsoleEventPrinter.attach(runner);

runner.benchmarks.addSuite(new LoggingBenchmarkSuite);

runner.parameters.set({
    'Logging.InitialRecordNumber': 0,
    'Logging.SourceQuantity': 10,
    'Logging.MongoUri': process.env['MONGO_URI'],
    'Logging.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'Logging.MongoPort': process.env['MONGO_PORT'] || 27017,
    'Logging.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});

runner.configuration.measurementType = MeasurementType.Peak;
runner.configuration.executionType = ExecutionType.Sequential;
runner.configuration.duration = 10;

runner.benchmarks.selectByName(['Logging.AddMongoDbLogMessages']);

runner.run((err: any) => {
    if (err) console.error(err);
});

// Log uncaught exceptions
process.on('uncaughtException', (ex) => {
    console.error(ex);
    console.error("Process is terminated");
    process.exit(1);
});

// Gracefully shutdown
process.on('exit', function () {
    runner.stop();
    //console.log("Goodbye!");
});
