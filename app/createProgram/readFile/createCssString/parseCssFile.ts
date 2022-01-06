import path from "path";
import sass from "sass";
import fs from "fs";
import { resolveQuotesInFileContent } from "./resolveQuotesInFileContent";
import { resolveUrl } from "./resolveUrl";
import { App } from "../../..";

export const parseCssFile = (
  fileName: string,
  fileContent: string
) => {
  return "alert('CSSSSSSSSSSSSSSS')"
  //   const result = sass.compile(fileName, {
  //     functions: {
  //       "url($filename)": function (filename) {
  //         console.log(
  //           "🚀 --> file: parseCssFile.ts --> line 25 --> filename",
  //           filename
  //         );
  //         return "sss"
  //         // (parameter) filename:
  //         // filename.
  //         // var url = resolveUrl(filename["getValue"]().trim(), fileName);
  //         // return new sass.types.String(`url("${url}")`);
  //       },
  //     },
  //     // sourceMapContents: App.devMode,
  //     sourceMap: App.devMode,
  //     // omitSourceMapUrl: true,
  //   });
  //   console.log("🚀 --> file: parseCssFile.ts --> line 19 --> result", result);

  //   return sass.renderSync({
  //     file: fileName,
  //     data: resolveQuotesInFileContent(fileContent),
  //     outputStyle: "compressed",
  //     outFile: fileName,
  //     importer: function (file: string) {
  //       var filePath = path.resolve(path.dirname(fileName) + "/" + file);
  //       if (fs.existsSync(filePath)) {
  //         return { file: filePath, contents: fs.readFileSync(filePath, "utf8") };
  //       }
  //       return { file: file, contents: undefined };
  //     },
  //     functions: {
  //       "url($filename)": function (filename) {
  //         console.log(
  //           "🚀 --> file: parseCssFile.ts --> line 25 --> filename",
  //           filename
  //         );
  //         // (parameter) filename:
  //         // filename.
  //         var url = resolveUrl(filename["getValue"]().trim(), fileName);
  //         return new sass.types.String(`url("${url}")`);
  //       },
  //     },
  //     sourceMapContents: App.devMode,
  //     sourceMap: App.devMode,
  //     omitSourceMapUrl: true,
  //   });
};
