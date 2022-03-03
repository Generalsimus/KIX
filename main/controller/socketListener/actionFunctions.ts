// import * as ts from "typescript"
import { createError } from "./createError";
import { AlertErrorType } from "./createError/alertErrorType";


// console.log("🚀 --> file: actionFunctions.ts --> line 2 --> ts", ts);
export const actionFunctions: Record<string, (data: any) => void> = {
    RESTART_SERVER: () => {
        window.location.reload();
    },
    ALERT_ERROR: (data: AlertErrorType) => {
        // console.log("🚀 --> file: actionFunctions.ts --> line 12 --> data", data);
        createError(data);
    }
}
