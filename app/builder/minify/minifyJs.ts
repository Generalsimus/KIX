
import UglifyJS from "uglify-js"
import remapping from "@ampproject/remapping"



export const minifyJs = (fileRequestPath: string, content: string, sourceMapString?: string) => {
    var result = UglifyJS.minify(content, {
        sourceMap: true
    });
    return {
        code: content,
        map: sourceMapString
    };
    content = result.code || content;
    let map: ReturnType<typeof remapping> | undefined;
    if (sourceMapString && result.map) {
        map = remapping(
            [result.map, sourceMapString],
            () => null
        );
        console.log("🚀 --> file: minifyJs.ts --> line 19 --> minifyJs --> map", sourceMapString);
        content = content + `\n//# sourceMappingURL=${fileRequestPath}.map`;
    }


    return {
        code: content,
        map: map && JSON.stringify(map)
    };
}