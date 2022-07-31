import path from "path";
import { createProgramHost } from "../..";
import { App } from "../../..";
import { minifyHtml } from "./minifyHtml";
import { minifyJs } from "./minifyJs";


export const minifyCode = async (fileRequestPath: string, content: string, host: createProgramHost) => {


    let sourceMap: string | undefined;
    switch (path.extname(fileRequestPath).toLocaleLowerCase()) {
        case ".js":
            const jsFileSourceMap = App.requestsThreshold.get(fileRequestPath + ".map")?.();

            const { code, map } = minifyJs(fileRequestPath, content, jsFileSourceMap, host);

            sourceMap = map;
            content = code;
            break;
        case ".html":
            content = await minifyHtml(content);
            break;
    }




    return {
        fileRequestPath,
        content,
        sourceMap
    }
}