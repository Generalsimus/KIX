import fs from 'fs';
import path from 'path';

export const makeFilePathExistSafe = (dirPath: string) => {
    const splitPath = dirPath.split(path.sep);

    for (let i = 1; i < splitPath.length; i++) {
        const dirPath = splitPath.slice(0, i).join(path.sep);

        try {
            fs.mkdirSync(dirPath);
        } catch (e) {
        }
    }


}