"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessageV1 = void 0;
class LogMessageV1 {
    constructor(level, source, correlationId, error, message) {
        this.time = new Date();
        this.level = level;
        this.source = source;
        this.correlation_id = correlationId;
        this.error = error;
        this.message = message;
    }
}
exports.LogMessageV1 = LogMessageV1;
//# sourceMappingURL=LogMessageV1.js.map