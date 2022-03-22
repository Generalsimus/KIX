import fs from "fs"
import ts from "typescript"
import { isPathNodeModule } from "./isPathNodeModule"

export const getResolvedModuleObject = (resolvedFileName: string) => {

    if (fs.existsSync(resolvedFileName)) {
        return {
            resolvedFileName,
            isExternalLibraryImport: isPathNodeModule(resolvedFileName),
            extension: ts.Extension.Js
        }
    }
}