import path from "path";
import { App } from "../app";

export const filePathToUrl = (fileName: string) => {
  return ("./" + path.relative(App.runDirName, fileName)).replace(/(^[\.\.\/]+)|([\\]+)/g, "/");
  // return ("./" + filePath).replace(/(^[\.\.\/]+)|(\/+)/g, "\\")
};
