import path from "path";
import { App } from "../..";
import { minifyJs } from "./minifyJs";


export const minifyCode = (fileRequestPath: string, content: string) => {
    // console.log("🚀 --> file: index.ts --> line 7 --> minifyCode --> fileRequestPath", fileRequestPath);





    let sourceMap: string | undefined;
    switch (path.extname(fileRequestPath).toLocaleLowerCase()) {
        case ".js":
            const jsFileSourceMap = App.requestsThreshold.get(fileRequestPath + ".map")?.();
            const { code, map } = minifyJs(fileRequestPath, content, jsFileSourceMap);
            sourceMap = map;
            content = code;
            break;
        // case ".html":
        //     return minifyJs(content, sourceMapString)
        // default:
        //     return content
    }



    return {
        fileRequestPath,
        content,
        sourceMap
    }
}