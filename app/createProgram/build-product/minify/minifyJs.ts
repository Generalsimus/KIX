
import UglifyJS, { SourceMapOptions } from "uglify-js"
import { createProgramHost } from "../.."
import { fileNameToUrlPath } from "../../../../utils/fileNameToUrlPath"



export const minifyJs = (fileRequestPath: string, content: string, sourceMapString: string | undefined, host: createProgramHost) => {

    let sourceMapObject: SourceMapOptions["content"] | undefined
    try {
        sourceMapObject = sourceMapString && JSON.parse(sourceMapString)
    } catch (e) {
        sourceMapString = undefined
    }



    const needToSourceMap = host.options.sourceMap
    var result = UglifyJS.minify(content, {
        sourceMap: needToSourceMap ? {
            includeSources: true,
            url: `${fileRequestPath}.map`,
            names: true,
            content: sourceMapObject
        } : false
    });


    return {
        code: result.code || content,
        map: result.map
    };
}