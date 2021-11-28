import { createErrorCode } from "../../error/createErrorCode";

export const ALERT_ERROR = (errorLocationData) => {
    // console.log("🚀 --> file: ALERT_ERROR.js --> line 2 --> errorLocationData", errorLocationData)
    createErrorCode(errorLocationData);
}