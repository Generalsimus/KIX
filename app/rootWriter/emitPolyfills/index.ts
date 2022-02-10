import path from "path";
import ts from "typescript";
import { rootWriter } from "..";
import { createProgramHost } from "../../createProgram";
import { getPolyfillsStringCodes } from "./polyfills";

export function emitPolyfills(writer: rootWriter, host: createProgramHost) {
    const polyfills = getPolyfillsStringCodes()
    const program = ts.createProgram({
        rootNames: [],
        options: {
            allowJs: true,
            checkJs: false,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            skipDeclarationErrors: true,
            target: host.options.target
        }
    })


    for (const index in polyfills) {
        const sourceFile = ts.createSourceFile(
            index + "source.js",
            polyfills[index],
            host.options.target ?? ts.ScriptTarget.ESNext,
            true,
            ts.ScriptKind.JS
        )
        sourceFile.hasNoDefaultLib = true
        program.emit(
            sourceFile,
            (__fileName, content) => {
                if (path.extname(__fileName) === ".js") {
                    writer.writeJsCode(__fileName, content)
                }
            }
        )
    }
}