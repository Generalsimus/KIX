import path from "path";
// import sass, { SassString } from "sass";
import { resolveQuotesInFileContent } from "./resolveQuotesInFileContent";
import { resolveUrl } from "./resolveUrl";
import { App } from "../../..";
import fs from "fs"
import url from "url"
import nodeSass from "node-sass";
import { encode, decode, SourceMapMappings } from 'sourcemap-codec';
import { remapCssURL } from "./remapCssURL";



export const parseCssFile = (
  fileName: string,
  fileContent: string
) => {

  const result = nodeSass.renderSync({
    file: fileName,
    outFile: "./fileName.js",
    data: fs.readFileSync(fileName, "utf8"),
    outputStyle: 'compressed',
    sourceMapContents: true,
    sourceMap: true,
    omitSourceMapUrl: true
  })
  const cssCode = result.css.toString();
  const sourceMap = JSON.parse(result.map.toString());



  // const { css, sourceMap } = remapCssURL(responseCss, Map, fileName) 
  return remapCssURL(cssCode, sourceMap, fileName)
};
