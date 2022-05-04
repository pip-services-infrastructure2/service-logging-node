let LoggingProcess = require('../obj/src/container/LoggingProcess').LoggingProcess;

try {
    new LoggingProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
