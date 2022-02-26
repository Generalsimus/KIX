import path from "path";
import { App } from "../..";
import { minifyHtml } from "./minifyHtml";
import { minifyJs } from "./minifyJs";


export const minifyCode = async (fileRequestPath: string, content: string) => {
    // console.log("🚀 --> file: index.ts --> line 7 --> minifyCode --> fileRequestPath", fileRequestPath);





    let sourceMap: string | undefined;
    switch (path.extname(fileRequestPath).toLocaleLowerCase()) {
        case ".js":
            const jsFileSourceMap = App.requestsThreshold.get(fileRequestPath + ".map")?.();
            const { code, map } = minifyJs(content, jsFileSourceMap);
            sourceMap = map;
            content = code;
            break;
        case ".html":
            content = await minifyHtml(content);
            break;
        // default:
        //     return content
    }



    // console.log("🚀 --> file: index.ts --> line 37 --> minifyCode --> fileRequestPath", fileRequestPath);
    return {
        fileRequestPath,
        content,
        sourceMap
    }
}