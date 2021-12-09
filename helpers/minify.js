import { App } from "../init/App";


export const minify = (fileCode, sourceMap) => {
    const minify = require("babel-minify");

    return minify(fileCode, {},
        {
            sourceMaps: !!App.__compilerOptions.sourceMap,
            inputSourceMap: typeof sourceMap === "string" ? JSON.parse(sourceMap) : sourceMap,
            comments: !!App.__compilerOptions.removeComments,
        }
    )


}