
import UglifyJS, { SourceMapOptions } from "uglify-js" 



export const minifyJs = (content: string, sourceMapString?: string) => {

    let sourceMapObject: SourceMapOptions["content"] | undefined
    try {
        sourceMapObject = sourceMapString && JSON.parse(sourceMapString)
    } catch (e) {
        sourceMapString = undefined
    }

    var result = UglifyJS.minify(content, {
        sourceMap:  {
            includeSources: true,
            names: true,
            content: sourceMapObject
        }
    }); 


    return {
        code: result.code || content,
        map: result.map
    };
}