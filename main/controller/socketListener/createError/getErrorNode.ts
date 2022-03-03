import { isNumber } from "../../../../utils/isNumber";
import Prism from "../prism/prism"
import { AlertErrorType } from "./alertErrorType";




const getPositionOfLine = (position: number, content: string) => {
    return content.substring(0, position).split("\n").length
}
const codeCutCount = 3;
const getFormattedErrorMessage = (error: AlertErrorType) => {
    if (!(isNumber(error.length) && isNumber(error.start) && error.fileText)) return
    const startLineIndex = getPositionOfLine(error.start, error.fileText)
    const endLineIndex = getPositionOfLine(error.start + error.length, error.fileText)
    const slitCode = error.fileText.split("\n");
    const slicedCode = slitCode.slice(
        Math.max(0, startLineIndex - codeCutCount),
        endLineIndex + codeCutCount + Math.min(startLineIndex - codeCutCount, 0)
    )
    // console.log("🚀 --> file: --> error_5", slitCode, endLineIndex - 1);
    return {
        line: startLineIndex,
        column: slitCode[endLineIndex - 1].length,
        slitCode,
        slicedCode,
        content: slicedCode.join("\n")
    }

}

export const getErrorNode = (error: AlertErrorType) => {

    const errorMessageNode = error.messageText && {
        h2: error.messageText,
        style: "color: #e33030;"
    }

    const code = getFormattedErrorMessage(error);

    const locationNode = code && {
        div: `at(${error.filePath}:${code.line}:${code.column})`,
        style: "color: #59769b;word-break: break-word;margin: 1vw 0;"
    };
    const errorCodeHighlightNode = code && {
        pre: [{
            div: code.slicedCode.map((_, index) => {
                return {
                    div: code.line + index - 2
                }
            }),
            style: "border-right: 1px solid #642b34;margin-right: 20px;display: flex;flex-direction: column;padding-right: 1em;"
        }, {
            div: code.slicedCode.map((_, index) => {
                return {
                    div: " ",
                    style: "width: 100%;background: #48242e;background: rgb(227 48 48 / " + (((index + 1) - codeCutCount) === 0 ? 0.2 : 0) + ");"
                }
            }),
            style: "position: absolute;width: 100%;display: flex;flex-direction: column;left: 0;pointer-events: none;"
        }, {
            code: (node: any) => {
                node.innerHTML = (Prism.highlight(code.content, (Prism as any).languages["tsx"], "tsx"))

            },
            class: "language-jsx",
        }],
        class: "line-numbers language-jsx",
        style: "border: 1px solid #353535; border-radius: 5px;display: flex;position:relative",
    }




    return {
        div: [
            errorMessageNode,
            locationNode,
            errorCodeHighlightNode
        ],
        style: "border: 7px solid #a0111100;padding: 0 1vw;border-radius: 5px;border-left-color: #e33030;box-shadow: 0px 0px 20px #ff000073;    margin-bottom: 4em;"
    }
}