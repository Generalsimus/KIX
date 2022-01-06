import path from "path";
import resolve from "resolve";
import fs from "fs";

export const resolveKixModule = (fileDirectory: string) => {
  try {
    return resolve.sync("kix", {
      basedir: fileDirectory,
      extensions: [".js", ".ts", ".jsx", ".tsx"],
    });
  } catch {
    const location = path.join(__dirname, "../../main/index.js");
    return fs.existsSync(location) && location;
  }
};
