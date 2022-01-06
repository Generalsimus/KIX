import fs from "fs";
import path from "path"; 
import { createCssString } from "./createCssString";

export const readFile = (fileName: string, charset: string): string => {
  // console.log("🚀 --> file: index.ts --> line 7 --> readFile --> fileName", fileName);
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
