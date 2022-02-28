// import * as ts from "typescript"
import { createError, ErrorType } from "./createError";


// console.log("🚀 --> file: actionFunctions.ts --> line 2 --> ts", ts);
export const actionFunctions: Record<string, (data: any) => void> = {
    RESTART_SERVER: () => {
        window.location.reload();
    },
    ALERT_ERROR: (data: ErrorType) => {
        createError(data);
    }
}
