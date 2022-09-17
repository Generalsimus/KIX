import fs from "fs"
import path from "path";
import { copyFileSync } from "./copyFileSync";


export const copyFolderSync = (from: string, to: string, ignorePaths: string[] = [], copyEmptyFolders = false) => {
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
            copyFolderSync(path.resolve(from, element), path.resolve(to, element), ignorePaths, copyEmptyFolders);
        })
        if (fs.readdirSync(to).length === 0 && !copyEmptyFolders) {
            fs.rmSync(to, {
                recursive: true
            })
        }
    }
}