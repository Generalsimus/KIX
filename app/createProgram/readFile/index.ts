import fs from "fs";
import path from "path";
import { createProgramHost } from "..";





export function readFile(this: createProgramHost, fileName: string): string | undefined {

  return fs.readFileSync(fileName, "utf8");
  // return this.readFileWithExt(fileName, path.extname(fileName)).fileText;
};
