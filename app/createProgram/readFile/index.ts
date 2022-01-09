import fs from "fs";
import path from "path";
import { App } from "../..";
import { createCssString } from "./createCssString";



export const newSourceFilesPathSet = new Set<string>();

export const readFile = (fileName: string, charset: string): string => {
  // App.moduleThree.get()
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
