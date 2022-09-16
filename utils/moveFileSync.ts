import fs from "fs"
import path from "path"
import { makeFilePathExistSafe } from "./makeFilePathExistSafe";

export const moveFileSync = (fromPath: string, toPath: string) => {

    makeFilePathExistSafe(toPath);
    fs.renameSync(fromPath, toPath);

}