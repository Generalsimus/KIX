"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorCode = void 0;
const index_1 = __importDefault(require("../../index"));
let ErrorBodyTag;
const createErrorCode = () => {
    if (ErrorBodyTag) {
        (0, index_1.default)(ErrorBodyTag, {
            div: [{
                    h2: "Uncaught Error: This is a demo template. Please, don't use it in your project.",
                    style: "color: #e33030;"
                }, {
                    div: "at (/APP.js:18:6)",
                    style: "color: #59769b;word-break: break-word;margin: 1vw 0;"
                }, {
                    pre: "CODE",
                    style: "border: 1px solid #353535; border-radius: 5px;display: flex;position:relative",
                }],
            style: "border: 7px solid #a0111100;padding: 0 1vw;border-radius: 5px;border-left-color: #e33030;box-shadow: 0px 0px 20px #ff000073;    margin-bottom: 4em;"
        });
    }
    else {
        let iframe = (0, index_1.default)(document.body, {
            iframe: [],
            style: `border: none;position: fixed;background: #262626;width: 100%;height: 100%;top: 0;left: 0;z-index:22222222222222222222222;`
        });
        let iframeBody = iframe.contentDocument.body;
        iframeBody.style = "margin: 0px;padding: 0px;";
        ErrorBodyTag = (0, index_1.default)(iframeBody, {
            div: {
                div: svgCloseIcon,
                style: `position: absolute;right: 0;top: 0;color: white;margin: 20px;cursor:pointer;`,
                e: {
                    click: () => {
                        iframe.remove();
                    }
                }
            },
            style: "padding: 5vw"
        });
    }
};
exports.createErrorCode = createErrorCode;
const svgCloseIcon = {
    svg: [{
            g: [{
                    rect: "",
                    x: "354",
                    y: "66.1335",
                    width: "61",
                    height: "404",
                    rx: "30.5",
                    transform: "rotate(45 354 66.1335)",
                    fill: "#E33030"
                }, {
                    rect: "",
                    x: "68",
                    y: "109.134",
                    width: "61",
                    height: "404",
                    rx: "30.5",
                    transform: "rotate(-45 68 109.134)",
                    fill: "#E33030"
                }],
            filter: "url(#filter0_d_1_6)"
        }, {
            defs: [{
                    filter: [{
                            feFlood: "",
                            "flood-opacity": "0",
                            result: "BackgroundImageFix"
                        }, {
                            feColorMatrix: "",
                            in: "SourceAlpha",
                            type: "matrix",
                            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                            result: "hardAlpha"
                        }, {
                            feOffset: "",
                            dy: "2"
                        }, {
                            feGaussianBlur: "",
                            stdDeviation: "40"
                        }, {
                            feComposite: "",
                            in2: "hardAlpha",
                            operator: "out"
                        }, {
                            feColorMatrix: "",
                            type: "matrix",
                            values: "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                        }, {
                            feBlend: "",
                            mode: "normal",
                            in2: "BackgroundImageFix",
                            result: "effect1_dropShadow_1_6"
                        }, {
                            feBlend: "",
                            mode: "normal",
                            in: "SourceGraphic",
                            in2: "effect1_dropShadow_1_6",
                            result: "shape"
                        }],
                    id: "filter0_d_1_6",
                    x: "0.633514",
                    y: "0.633514",
                    width: "463.866",
                    height: "463.671",
                    filterUnits: "userSpaceOnUse",
                    "color-interpolation-filters": "sRGB"
                }]
        }],
    width: "25",
    height: "25",
    viewBox: "0 0 465 465",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};
