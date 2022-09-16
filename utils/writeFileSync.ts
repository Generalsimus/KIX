import fs from "fs"
import { makeFilePathExistSafe } from "./makeFilePathExistSafe";
import path from "path"

export const writeFileSync = (filePath: string, fileContent: string) => {
    console.log("🚀 --> file: writeFileSync.ts --> line 6 --> writeFileSync --> filePath", filePath);
    makeFilePathExistSafe(filePath)
    // makePathExistSafe(path.dirname(filePath))
    // const ext = fs.existsSync(path.dirname(filePath))
    // console.log("🚀 --> file: writeFileSync.ts --> line 7 --> writeFileSync --> ext", ext);
    fs.writeFileSync(filePath, fileContent)


}