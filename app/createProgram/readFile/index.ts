import fs from "fs";
import path from "path";
import { createProgramHost } from "..";
import { createCssString } from "./createCssString";
import { createUrlLoader } from "./createUrlLoader";





export function readFile(this: createProgramHost, fileName: string): string {
  // console.log("🚀 --> file: index.ts --> line 11 --> readFile --> fileName", fileName);
  // App.moduleThree.get()
  // if (!fs.existsSync(fileName)) { return }
  // newSourceFilesPathSet.add(fileName)

  // let codeScript = fs.readFileSync(fileName, "utf8");

  switch (path.extname(fileName)) {
    case ".css":
    case ".scss":
      return createCssString(fileName, fs.readFileSync(fileName, "utf8"), this);
    case ".ts":
    case ".tsx":
    case ".js":
    case ".jsx":
    case ".json":
      return fs.readFileSync(fileName, "utf8")
    default:
      return createUrlLoader(fileName)
  }
  // return codeScript;
};
