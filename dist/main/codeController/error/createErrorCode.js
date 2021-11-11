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
        let iframeBody = (0, index_1.default)(document.body, {
            iframe: [],
            style: `border: none;position: fixed;background: #262626;width: 100%;height: 100%;top: 0;left: 0;z-index:22222222222222222222222;`
        }).contentDocument.body;
        iframeBody.style = "margin: 0px;padding: 0px;";
        ErrorBodyTag = (0, index_1.default)(iframeBody, {
            div: {
                div: svgCloseIcon,
                style: `position: absolute;right: 0;top: 0;color: white;margin: 2vw;`
            },
            style: "padding: 5vw;"
        });
    }
};
exports.createErrorCode = createErrorCode;
const svgCloseIcon = {
    svg: [{
            g: [{
                    path: "",
                    "fill-rule": "evenodd",
                    "clip-rule": "evenodd",
                    d: "M46.1317 45.8683C41.6407 50.3593 41.6407 57.6407 46.1317 62.1317L88 104L46.1662 145.834C41.6752 150.325 41.6752 157.606 46.1662 162.097C50.6572 166.588 57.9386 166.588 62.4297 162.097L104.263 120.263L145.834 161.834C150.325 166.325 157.606 166.325 162.097 161.834C166.588 157.343 166.588 150.061 162.097 145.57L120.527 104L162.132 62.3952C166.623 57.9042 166.623 50.6228 162.132 46.1317C157.641 41.6407 150.359 41.6407 145.868 46.1317L104.263 87.7365L62.3952 45.8683C57.9042 41.3772 50.6228 41.3772 46.1317 45.8683Z",
                    fill: "#E33030"
                }],
            filter: "url(#filter0_d_18_6)"
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
                            feOffset: ""
                        }, {
                            feGaussianBlur: "",
                            stdDeviation: "21"
                        }, {
                            feComposite: "",
                            in2: "hardAlpha",
                            operator: "out"
                        }, {
                            feColorMatrix: "",
                            type: "matrix",
                            values: "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0"
                        }, {
                            feBlend: "",
                            mode: "normal",
                            in2: "BackgroundImageFix",
                            result: "effect1_dropShadow_18_6"
                        }, {
                            feBlend: "",
                            mode: "normal",
                            in: "SourceGraphic",
                            in2: "effect1_dropShadow_18_6",
                            result: "shape"
                        }],
                    id: "filter0_d_18_6",
                    x: "0.763455",
                    y: "0.5",
                    width: "206.737",
                    height: "206.966",
                    filterUnits: "userSpaceOnUse",
                    "color-interpolation-filters": "sRGB"
                }]
        }],
    width: "35",
    height: "35",
    viewBox: "0 0 208 208",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};
