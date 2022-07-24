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



    switch (extName.toLowerCase()) {
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
            return {
                scriptKind: ts.ScriptKind.TS,
                fileText: fs.readFileSync(fileName, "utf8")
            };
        case ".tsx":
            return {
                scriptKind: ts.ScriptKind.TSX,
                fileText: fs.readFileSync(fileName, "utf8")
            };
        case ".js":
            return {
                scriptKind: ts.ScriptKind.JS,
                fileText: fs.readFileSync(fileName, "utf8")
            };
        case ".jsx":
            return {
                scriptKind: ts.ScriptKind.JSX,
                fileText: fs.readFileSync(fileName, "utf8")
            };
        case ".json":
            return {
                scriptKind: ts.ScriptKind.JS,
                fileText: `export default ${fs.readFileSync(fileName, "utf8").trim() || "{}"}`
            };
        default:
            return {
                scriptKind: ts.ScriptKind.JS,
                fileText: createUrlLoader(fileName)
            };
    }
};
