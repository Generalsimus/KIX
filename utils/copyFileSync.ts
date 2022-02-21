import fs from 'fs';
import path from 'path';
import { makePathExistSafe } from './makePathExistSafe';


export const copyFileSync = (fromPath: string, toPath: string) => {
    makePathExistSafe(toPath);
    makePathExistSafe(toPath);
    fs.copyFileSync(fromPath, toPath)

}
