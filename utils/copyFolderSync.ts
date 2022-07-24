import fs from "fs"
import path from "path";
import { copyFileSync } from "./copyFileSync";


export const copyFolderSync = (from: string, to: string, ignorePaths: string[] = []) => {
    const stat = fs.lstatSync(from);

    if (ignorePaths.includes(from)) {
        return
    }
    if (stat.isFile()) {
        copyFileSync(from, to)
    } else if (stat.isSymbolicLink()) {
        fs.symlinkSync(
            fs.readlinkSync(from),
            to
        )
    } else if (stat.isDirectory()) {
        try {
            fs.mkdirSync(to);
        } catch (e) { }
        fs.readdirSync(from).forEach((element) => {
            copyFolderSync(path.join(from, element), path.join(to, element), ignorePaths);
        })
        if (!fs.readdirSync(to).length) {
            fs.rmSync(to, {
                recursive: true
            })
        }
    }
}