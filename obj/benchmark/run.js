"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const pip_benchmark_node_3 = require("pip-benchmark-node");
const pip_benchmark_node_4 = require("pip-benchmark-node");
const LogMessageBenchmarkSuite_1 = require("./LogMessageBenchmarkSuite");
let runner = new pip_benchmark_node_1.BenchmarkRunner();
pip_benchmark_node_2.ConsoleEventPrinter.attach(runner);
runner.benchmarks.addSuite(new LogMessageBenchmarkSuite_1.LoggingBenchmarkSuite);
runner.parameters.set({
    'Logging.InitialRecordNumber': 0,
    'Logging.SourceQuantity': 10,
    'Logging.MongoUri': process.env['MONGO_URI'],
    'Logging.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'Logging.MongoPort': process.env['MONGO_PORT'] || 27017,
    'Logging.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});
runner.configuration.measurementType = pip_benchmark_node_3.MeasurementType.Peak;
runner.configuration.executionType = pip_benchmark_node_4.ExecutionType.Sequential;
runner.configuration.duration = 10;
runner.benchmarks.selectByName(['Logging.AddMongoDbLogMessages']);
runner.run((err) => {
    if (err)
        console.error(err);
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
//# sourceMappingURL=run.js.map