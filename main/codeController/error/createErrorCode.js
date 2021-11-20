import kix from "../../index"
import Prism from "./prismjs/prism";
import {
    prismaCssStyle
} from "./prismjs/prismjsCSS";
import {
    svgCloseIcon
} from "./svgCloseIcon";

let ErrorBodyTag;
export const createErrorCode = ({
    fileCode,
    line,
    errorMessage,
    column,
    path,
    url
}) => {
    const errorLine = line;
    const fileSplitCode = fileCode.split(/\r?\n/);
    const slicedCode = fileSplitCode.slice(Math.max(errorLine - 5, 0), 10 + Math.max(errorLine - 5, 0))
    if (!ErrorBodyTag) {
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
                    kix(iframeBody, ErrorBodyTag)
                }
            }
        })
        ErrorBodyTag = kix(null, {
            div: {
                div: svgCloseIcon,
                style: `cursor: pointer;display: flex;position: fixed;top: 0;color: white;background: #262626;right: 27px;width: 45px;height: 60px;align-items: end;justify-content: center;border: 1px solid #e3303047;border-top: navajowhite;box-shadow: 0px 0px 20px #ff000012;border-bottom-left-radius: 250px;border-bottom-right-radius: 250px;padding-bottom: 10px;z-index: 222222222222222222222;`,
                e: {
                    click: () => {
                        iframe.remove()
                    }
                }
            },
            style: "padding: 5vw"
        })

    }

    // crearte errorr View

    kix(ErrorBodyTag, {
        div: [{
            h2: errorMessage,
            style: "color: #e33030;"
        }, {
            div: `at (${path}:${line}:${column})`,
            style: "color: #59769b;word-break: break-word;margin: 1vw 0;"
        }, {
            div: {
                pre: [{
                    div: slicedCode.map((_, index) => {
                        return {
                            div: Math.max(errorLine - 5, 0) + index + 1
                        }
                    }),
                    style: "border-right: 1px solid #642b34;margin-right: 20px;display: flex;flex-direction: column;padding-right: 1em;"
                }, {
                    div: () => {
                        const childs = []

                        for (var i = 0; i <= Math.abs(Math.min(errorLine - 6, 0) - 5); i++) {
                            childs.push({
                                div: " ",
                                style: "width: 100%;background: #48242e;background: rgb(227 48 48 / " + ((i + 1) == errorLine - Math.max(errorLine - 5, 0) ? 0.2 : 0) + ");"
                            })
                        }
                        return childs
                    },
                    style: "position: absolute;width: 100%;display: flex;flex-direction: column;left: 0;pointer-events: none;"
                }, {
                    code: (node) => {
                        node.Inner(Prism.highlight(slicedCode.join("\n"), Prism.languages["tsx"], "tsx"))
                        return []
                    },
                    class: "language-jsx",
                }],
                class: "line-numbers language-jsx",
                style: "border: 1px solid #353535; border-radius: 5px;display: flex;position:relative",
            }
        }],
        style: "border: 7px solid #a0111100;padding: 0 1vw;border-radius: 5px;border-left-color: #e33030;box-shadow: 0px 0px 20px #ff000073;    margin-bottom: 4em;"

    })
    // end create error view
}