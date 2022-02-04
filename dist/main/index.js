"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__R = exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const abstractNodes = {};
const abstractAttributes = {
    setAttr(attribute, value) {
        value = flatFunction(value, this, attribute);
        abstractAttributes[attribute] ? this[attribute](value, attribute) : this.setAttribute(attribute, value);
    },
    Append(childNode) {
        return (0, exports.kix)(this, childNode);
    },
    Remove() {
        const parentNode = this.Parent();
        parentNode && parentNode.removeChild(this);
        return this;
    },
    Replace(replaceNode) {
        const parent = this.Parent();
        if (parent) {
            replaceNode = (0, exports.kix)(null, flatFunction(replaceNode, this.Parent()));
            parent.replaceChild(replaceNode, this);
            return replaceNode;
        }
    },
};
for (const key of abstractAttributes) {
    (Node.prototype[key] = abstractAttributes[key]);
}
+function createApp(createElementName) {
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
        return elementNode;
    }
    return function kix(parent, child) {
        switch (type(child)) {
            case "[object Array]":
                return child.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, child(parent));
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
            case "[object String]":
            case "[object Number]":
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
};
const createSvgNode = createApp((nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName));
exports.kix = createApp(document.createElement.bind(document));
exports.default = exports.kix;
const toArrayAndFill = (node) => node instanceof Array ? 0 in node ? node : [""] : [node];
function replaceChildNodes(values, nodes, valuesIndex, returnNodes, value, node) {
    while ((value = values[valuesIndex]) || (node = nodes[valuesIndex])) {
        if (value instanceof Array) {
            values[valuesIndex] = replaceChildNodes(values, nodes, 0, returnNodes);
        }
        else if (node instanceof Array) {
            values[valuesIndex] = replaceChildNodes(values, nodes, 0, returnNodes);
        }
        else {
        }
        valuesIndex++;
    }
    return returnNodes;
}
function __R(registerFunction) {
    const getRenderValue = (parent, attribute) => {
        console.log({ parent, attribute, registerFunction });
        return registerFunction(function () {
            const Time = new Date().getTime();
            console.time("objValue" + Time);
            const objValue = Array.prototype.reduce.call(arguments, (obj, key) => {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                let value = obj[key], defineRegistrations = descriptor.registrations || [];
                if (defineRegistrations.indexOf(registerFunction) !== -1)
                    return value;
                defineRegistrations.push(registerFunction);
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    registrations: defineRegistrations,
                    get() {
                        return value;
                    },
                    set(setValue) {
                        value = setValue;
                        descriptor.set && descriptor.set(value);
                        if (attribute) {
                            parent.setAttr(attribute, value);
                        }
                        else {
                        }
                    }
                });
                console.timeEnd("objValue" + Time);
                return value;
            });
            return objValue;
        });
    };
    return getRenderValue;
}
exports.__R = __R;
