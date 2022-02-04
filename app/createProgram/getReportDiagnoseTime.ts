import ts from "typescript";
import { createProgramHost } from ".";

export function getReportDiagnoseTime(this: createProgramHost) {
    // ts.sys.write(`\x1Bc${(this.reportDiagnoseTime = `[${"\u001B[90m" + new Date().toLocaleTimeString() + "\u001b[0m"}]`)} File change detected. Starting incremental compilation...` + ts.sys.newLine)

}