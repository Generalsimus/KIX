import fs from "fs"
import path from "path/posix";

export const safeFileWrite = (filePath, fileContent) => {
    const splitPath = filePath.split(/[\\/]/)


    for (let i = 1; i < splitPath.length; i++) {
        const path = splitPath.slice(0, i).join('\\')
        try {
            fs.mkdirSync(path);
        } catch (e) { }
    }

    fs.writeFileSync(filePath, fileContent, "utf8")


}