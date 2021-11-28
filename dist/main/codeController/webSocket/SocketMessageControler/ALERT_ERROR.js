"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALERT_ERROR = void 0;
const createErrorCode_1 = require("../../error/createErrorCode");
const ALERT_ERROR = (errorLocationData) => {
    // console.log("🚀 --> file: ALERT_ERROR.js --> line 2 --> errorLocationData", errorLocationData)
    (0, createErrorCode_1.createErrorCode)(errorLocationData);
};
exports.ALERT_ERROR = ALERT_ERROR;
