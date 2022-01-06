import fs from "fs"
import path from "path";


export const copyFolderSync = (from: string, to: string, ignorePaths: string[] = []) => {
    const stat = fs.lstatSync(from);

    if (ignorePaths.includes(from)) {
        return
    }
    if (stat.isFile()) {
        fs.copyFileSync(from, to)
    } else if (stat.isSymbolicLink()) {
        fs.symlinkSync(
            fs.readlinkSync(from),
            to
        )
    } else if (stat.isDirectory()) {
        try {
            fs.mkdirSync(to);
        } catch (e) { }
        console.log("🚀 --> file: copyFolderSync.ts --> line 25 --> fs.readdirSync --> fs.readdirSync(from)", fs.readdirSync(from));
        fs.readdirSync(from).forEach((element) => {
            copyFolderSync(path.join(from, element), path.join(to, element), ignorePaths);
        })
        if (!fs.readdirSync(to).length) {
            fs.rmdirSync(to, {
                recursive: true
            })
        }
    }
}