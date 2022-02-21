import fs from "fs"
import path from "path/posix";
import { makePathExistSafe } from "./makePathExistSafe";

export const writeFileSync = (filePath: string, fileContent: string) => {
    makePathExistSafe(filePath)
    fs.writeFileSync(filePath, fileContent, "utf8")


}