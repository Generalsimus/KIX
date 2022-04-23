import fs from "fs";
import ts from "typescript";
import { createProgramHost } from "..";
import { fileNameToUrlPath } from "../../../utils/fileNameToUrlPath";
import { createCssString } from "./createCssString";
import { createUrlLoader } from "./createUrlLoader";





export function readFileWithExt(this: createProgramHost, fileName: string, extName: string): {
    scriptKind?: ts.ScriptKind,
    fileText?: string,
} {

    // console.log("🚀 --> file: readFileWithExt.ts --> line 18 --> readFileWithExt --> extName", extName);
    switch (extName) {
        case ".svg":
            const fileText1 = fs.readFileSync(fileName, "utf8");
            return {
                scriptKind: ts.ScriptKind.JSX,
                fileText: fileText1 && `
                export default ${fileText1};
                export const url = "${fileNameToUrlPath(fileName)}";
                `
            };
        case ".css":
        case ".scss":
            const fileText2 = fs.readFileSync(fileName, "utf8");
            return {
                scriptKind: ts.ScriptKind.JS,
                fileText: fileText2 && createCssString(fileName, fileText2, this)
            };
        case ".ts":
        case ".tsx":
        case ".js":
        case ".jsx":
        case ".json":
            return {
                scriptKind: undefined,
                fileText: fs.readFileSync(fileName, "utf8")
            };
        default:

            return {
                scriptKind: ts.ScriptKind.JS,
                fileText: createUrlLoader(fileName)
            };
    }
};
