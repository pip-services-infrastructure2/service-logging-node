"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessageV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class LogMessageV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        let errorSchema = new pip_services3_commons_nodex_1.ObjectSchema()
            .withOptionalProperty('code', pip_services3_commons_nodex_2.TypeCode.String)
            .withOptionalProperty('message', pip_services3_commons_nodex_2.TypeCode.String)
            .withOptionalProperty('stack_trace', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('correlation_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('source', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('level', pip_services3_commons_nodex_2.TypeCode.Long);
        this.withOptionalProperty('message', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('error', errorSchema);
    }
}
exports.LogMessageV1Schema = LogMessageV1Schema;
//# sourceMappingURL=LogMessageV1Schema.js.map