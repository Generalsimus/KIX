import fs from 'fs';
import ts from 'typescript';


export const parseJsonFile = (fileName: string) => {
    if (!fs.existsSync(fileName)) {
        throw new Error(`File ${fileName} does not exist`);
    }
    return ts.parseConfigFileTextToJson(fileName, fs.readFileSync(fileName, "utf8"))
}