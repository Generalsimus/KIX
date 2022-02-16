import fs from "fs"
import nodeSass from "node-sass";
import path from "path";
import { createProgramHost } from "../..";
import { App } from "../../..";
import { remapCssURL } from "./remapCssURL";



export const parseCssFile = (
  fileName: string,
  fileContent: string,
  host: createProgramHost,
) => {

  try {
    const result = nodeSass.renderSync({
      file: fileName,
      outFile: path.relative(App.runDirName, fileName),
      importer: function (url: string, prev: string) {
        try {
          new URL(url);
          return null
        } catch (e) {
          var fileImportName = path.join(path.dirname(prev), url)
          if (fs.existsSync(fileImportName)) {

            // ემატება ფაილების ცვლილების მსმენელიიიი
            host.staticFileWatcher.addFile(fileImportName, () => {
              host.watcherCallBack(fileName)
            })
            ///////////////////////////////////////////////////////////
            return { file: fileImportName, contents: fs.readFileSync(fileImportName, "utf8") };
          }
        }


        return Error(`Import Module ${url} not found`);
      },
      data: fileContent,
      outputStyle: 'compressed',
      sourceMapContents: true,
      sourceMap: true,
      omitSourceMapUrl: true
    })
    const cssCode = result.css.toString();
    const sourceMap = JSON.parse(result.map.toString());
    return remapCssURL(cssCode, sourceMap, fileName)

  } catch (e: any) {

    throw new Error("\n" + e.formatted)
  }




};
