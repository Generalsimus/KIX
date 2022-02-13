import path from "path";
// import sass, { SassString } from "sass";
import { resolveQuotesInFileContent } from "./resolveQuotesInFileContent";
import { resolveUrl } from "./resolveUrl";
import { App } from "../../..";
import fs from "fs"
import url from "url"
import nodeSass from "node-sass";
import { encode, decode, SourceMapMappings } from 'sourcemap-codec';



export const parseCssFile = (
  fileName: string,
  fileContent: string
) => {

  const content = resolveQuotesInFileContent(fs.readFileSync(fileName, "utf8"));
  console.log({ content });
  const result = nodeSass.renderSync({
    file: fileName,
    outFile: "./fileName.js",
    data: fs.readFileSync(fileName, "utf8"),
    outputStyle: 'compressed',
    sourceMapContents: true,
    sourceMap: true,
    omitSourceMapUrl: true
  })
  const responseCss = result.css.toString();
  const Map = JSON.parse(result.map.toString());
  console.log("🚀 --> file: parseCssFile.ts --> line 31 --> Map", Map);
  const regex = /(\burl\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g
  const remapCSSURL = (css: string, sourceMap: { source: string[], sourcesContent: string[], mappings: string }) => {
    const decodedMappings = decode(sourceMap.mappings)
    const cssSplitCache: string[][] = []
    const codeSplit = css.split('\n')
    for (const lineInGeneratedCode in decodedMappings) {
      let originalColumn = 0;
      let generatedLastColumn = 0;
      for (const lineVLQ of decodedMappings[lineInGeneratedCode]) {
        const sourceIndex: number = (lineVLQ as any)[1]
        const columnGeneratedCode: number = (lineVLQ as any)[0]
        const columnOriginalCode: number = (lineVLQ as any)[3]
        const lineOriginalCode: number = (lineVLQ as any)[2]
        const originalCode: string = sourceMap.sourcesContent[sourceIndex]
        const originalCodeLineString = (cssSplitCache[sourceIndex] || (cssSplitCache[sourceIndex] = originalCode.split("\n")))[lineOriginalCode]
        const generatedCodeLineString = codeSplit[lineInGeneratedCode]

        // console.log("🚀 --> originalCodeLineString", originalCodeLineString);
        const cutOriginal = originalCodeLineString.slice(originalColumn, columnOriginalCode)
        originalColumn = columnOriginalCode;
        const cutGenerated = generatedCodeLineString.slice(generatedLastColumn, columnGeneratedCode)
        generatedLastColumn = columnGeneratedCode;
        console.log(cutOriginal, "(", cutGenerated, ")", regex.test(cutGenerated));
        // cssLines
      }

    }

  }
  console.log(remapCSSURL(responseCss, Map));
  // const result = sass.compileString(content, {
  //   // file: fileName,
  //   importers: [
  //     {
  //       findFileUrl(fileUrl) {
  //         console.log(url.pathToFileURL(path.resolve(path.dirname(fileName), fileUrl)).pathname)
  //         console.log(this)
  //         return url.pathToFileURL(path.resolve(path.dirname(fileName), fileUrl));
  //       },
  //     },
  //     // {
  //     //   canonicalize(fileUrl) {
  //     //     // console.log("🚀 --> file: parseCssFile.ts --> line 29 --> canonicalize --> fileUrl", fileUrl);
  //     //     // if (!url.startsWith('bgcolor:')) return null;


  //     //     // return null
  //     //     return new URL(fileUrl, "http://e/")
  //     //     // return url.pathToFileURL(path.resolve(path.dirname(fileName), fileUrl));
  //     //     // return url.pathToFileURL(path.resolve(path.dirname(fileName), fileUrl));
  //     //   },
  //     //   load(canonicalUrl) {
  //     //     console.log("🚀 --> file: parseCssFile.ts --> line 35 --> load --> canonicalUrl", canonicalUrl);
  //     //     return {
  //     //       contents: fs.readFileSync(path.resolve(canonicalUrl.pathname), "utf8"),
  //     //       syntax: 'scss'
  //     //     };
  //     //   }
  //     // }


  //   ],
  //   functions: {
  //     "url($fileUrl)": function ([fileUrl]) {
  //       const value = fileUrl.assertString('fileUrl').text.trim();
  //       const url = resolveUrl(value, fileName);

  //       return new SassString(`url("${url}")`, { quotes: false });
  //     }
  //   },
  //   style: "compressed",
  //   sourceMap: App.devMode,

  // });
  // console.log({ result });


  return result
};
