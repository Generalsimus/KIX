"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaCssStyle = void 0;
exports.prismaCssStyle = `
code[class*="language-"],
pre[class*="language-"] {
    color: #ccc;
    background: 0 0;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
    background: #282a36;
}

:not(pre) > code[class*="language-"] {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
}

.token.block-comment,
.token.cdata,
.token.comment,
.token.doctype,
.token.prolog {
    color: #999;
}

.token.punctuation {
    color: #6272a4;
}

.token.tag {
    color: #038dff;
}

.token.attr-name {
    color: #9cdcfe;
}

.token.deleted,
.token.namespace {
    color: #fff;
}

.token.function-name {
    color: #6196cc;
}

.token.boolean {
    color: #448dff;
}

.token.number {
    color: #b5cea8;
}

.token.function {
    color: #ffb86c;
}

.token.class-name,
.token.constant,
.token.property,
.token.symbol {
    color: #bd93f9;
}

.token.atrule,
.token.builtin,
.token.important,
.token.keyword,
.token.selector {
    color: #ff79c6;
}

.token.attr-value,
.token.char,
.token.regex,
.token.string,
.token.variable {
    color: #ce9178;
}

.token.entity,
.token.operator,
.token.url {
    color: #67cdcc;
}

.token.bold,
.token.important {
    font-weight: 700;
}

.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}

.token.inserted {
    color: green;
}

`;
