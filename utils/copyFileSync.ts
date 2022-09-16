import fs from 'fs';
import path from 'path';
import { makeFilePathExistSafe } from './makeFilePathExistSafe';


export const copyFileSync = (fromPath: string, toPath: string) => {
    makeFilePathExistSafe(toPath);
    makeFilePathExistSafe(toPath);
    fs.copyFileSync(fromPath, toPath)

}
