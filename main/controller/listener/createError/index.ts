import * as ts from "typescript";
import { kix } from "../../../index.js";

console.log("🚀 --> file: index.ts --> line 2 --> ts", ts);
export interface ErrorType extends ts.Diagnostic {
    fileText?: string;
    file: undefined;
}

let GlobalErrorWindow: HTMLElement | undefined



export const createError = (error: ErrorType) => {
    console.log("🚀 --> file: index.ts --> line 14 --> createError --> error", error);
    if (!GlobalErrorWindow) {
        GlobalErrorWindow = kix(document.body, {
            iframe: [],
            style: `border: none;position: fixed;background: #262626;width: 100%;height: 100%;top: 0;left: 0;z-index:22222222222222222222222;`,
            e: {
                load: () => {
                    // let iframeDocument = (GlobalErrorWindow.contentWindow.document);
                    // let iframeBody = iframeDocument.body;
                    // kix(iframeDocument.head, {
                    //     style: [
                    //         prismaCssStyle
                    //     ]
                    // })
                    // iframeBody.style = "margin: 0px;padding: 0px;"
                    // kix(iframeBody, ErrorBodyTag)
                }
            }
        })
    }
}