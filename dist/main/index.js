"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const abstractNodes = {};
const abstractAttributes = {
    setAttr(attribute, value) {
        this.setAttribute(attribute, value);
    }
};
Object.assign(Node.prototype, abstractAttributes);
function createApp(createElementName) {
    function createElement(objectNode, elementNode) {
        for (var objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            }
            else {
                if (abstractNodes[objectNodeProperty]) {
                    return abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement);
                }
                (0, exports.kix)((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
            }
        }
    }
    const registrator = () => { };
    return function kix(parent, child) {
        switch (type(child)) {
            case "[object Array]":
                return child.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, child(registrator));
            case "[object Object]":
                child = createElement(child);
                break;
            case "[object Promise]":
                child.then(function (result) {
                    child.Replace(result);
                });
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                child = "";
            case "[object Number]":
            case "[object String]":
            case "[object Date]":
            case "[object RegExp]":
            case "[object BigInt]":
            case "[object Symbol]":
            case "[object Error]":
            case "[object Date]":
                const textNode = document.createTextNode(String(child));
                textNode._kixNode = child;
                child = textNode;
        }
        return parent && parent.appendChild(child), child;
    };
}
const createSvgNode = createApp((nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName));
exports.kix = createApp(document.createElement.bind(document));
exports.default = exports.kix;
