import { kix } from "../../../index.js";
import prism from "../prism/prism";
import {
    prismaCssStyle
} from "../prism/prismjsCSS";
import { AlertErrorType } from "./alertErrorType.js";
import { getErrorNode } from "./getErrorNode.js";


let GlobalErrorBodyTag: HTMLDivElement | undefined
export const createError = (error: AlertErrorType) => {
    if (!GlobalErrorBodyTag) {
        let iframe = kix(document.body, {
            iframe: [],
            style: `border: none;position: fixed;background: #262626;width: 100%;height: 100%;top: 0;left: 0;z-index:22222222222222222222222;`,
            e: {
                load: () => {
                    let iframeDocument = (iframe.contentWindow.document);
                    let iframeBody = iframeDocument.body;
                    kix(iframeDocument.head, {
                        style: [
                            prismaCssStyle
                        ]
                    })
                    iframeBody.style = "margin: 0px;padding: 0px;"
                    kix(iframeBody, GlobalErrorBodyTag)
                }
            }
        })
        GlobalErrorBodyTag = kix(null, {
            div: {
                div: "X",
                style: `cursor: pointer;display: flex;position: fixed;top: 0;color: white;background: #262626;right: 27px;width: 45px;height: 60px;align-items: end;justify-content: center;border: 1px solid #e3303047;border-top: navajowhite;box-shadow: 0px 0px 20px #ff000012;border-bottom-left-radius: 250px;border-bottom-right-radius: 250px;padding-bottom: 10px;z-index: 222222222222222222222;`,
                e: {
                    click: () => {
                        GlobalErrorBodyTag = undefined;
                        iframe.Remove();
                    }
                }
            },
            style: "padding: 5vw"
        })
    }
    kix(GlobalErrorBodyTag, getErrorNode(error))
}
