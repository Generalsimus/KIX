import path from "path";
import { runDirectory } from "../app";

export const filePathToUrl = (fileName: string) => {
  return ("./" + path.relative(runDirectory, fileName)).replace(/(^[\.\.\/]+)|([\\]+)/g, "/");
  // return ("./" + filePath).replace(/(^[\.\.\/]+)|(\/+)/g, "\\")
};
