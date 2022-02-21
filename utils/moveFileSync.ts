import fs from "fs"
import path from "path"
import { makePathExistSafe } from "./makePathExistSafe";

export const moveFileSync = (fromPath: string, toPath: string) => {

    makePathExistSafe(toPath);
    fs.renameSync(fromPath, toPath);

}