import fs from "fs";
import path from "path";
import { App } from "../..";
import { createCssString } from "./createCssString";



export const newSourceFilesPathSet = new Set<string>();

export const readFile = (fileName: string): string => {
  // console.log("🚀 --> file: index.ts --> line 11 --> readFile --> fileName", fileName);
  // App.moduleThree.get()
  // if (!fs.existsSync(fileName)) { return }
  newSourceFilesPathSet.add(fileName)

  let codeScript = fs.readFileSync(fileName, "utf8");

  switch (path.extname(fileName)) {
    case ".css":
    case ".scss":
      return createCssString(fileName, codeScript);
    // case ".ts":
    // case ".tsx":
    // case ".js":
    // case ".jsx":
  }
  return codeScript;
};
