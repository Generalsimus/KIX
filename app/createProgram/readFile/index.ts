import path from "path";
import { createProgramHost } from "..";





export function readFile(this: createProgramHost, fileName: string): string | undefined {


  return this.readFileWithExt(fileName, path.extname(fileName)).fileText;
};
