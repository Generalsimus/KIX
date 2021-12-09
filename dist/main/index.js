"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.style = exports.createNodeApp = exports.AttributeMethods = exports.NodeMethods = exports.getRouteParams = void 0;
const type = (typeArg) => Object.prototype.toString.call(typeArg).match(/\w+/g)[1];
const flatFunction = (ifFunc, ...args) => ifFunc instanceof Function ? flatFunction(ifFunc(...args)) : ifFunc;
let params = {};
const getRouteParams = () => params;
exports.getRouteParams = getRouteParams;
Object.defineProperty(window.location, "params", {
    get: () => params
});
Object.defineProperties(Object.prototype, {
    useListener: {
        value: function (property, runFunction) {
            const descriptor = Object.getOwnPropertyDescriptor(this, property);
            let value = this[property];
            runFunction = runFunction.bind(this);
            Object.defineProperty(this, property, {
                get: function () {
                    return value;
                },
                set: function (newValue) {
                    (descriptor.set && descriptor.set(newValue));
                    runFunction(newValue, property, value);
                    value = newValue;
                },
            });
            return "event";
        }
    }
});
const createSvgElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName);
exports.NodeMethods = {
    svg(objectNode, nodeName, createElement, createKixElement) {
        const newNode = { ...objectNode }, element = createSvgElement("svg");
        delete newNode.svg;
        createSvgNode(createKixElement(newNode, element), objectNode.svg);
        return element;
    },
    switch(switchObjectNode, nodeName, createElement, createKixElement) {
        let newSwitchObjectNode = {
            ...switchObjectNode
        };
        delete newSwitchObjectNode[nodeName];
        return createKixElement(newSwitchObjectNode, createElement("a")).e({
            click: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                const event = document.createEvent("Event");
                event.state = {
                    ID: new Date().getTime(),
                };
                history.pushState(event.state, document.title, this.getAttr("href"));
                event.initEvent("popstate", true, true);
                window.dispatchEvent(event);
            },
        });
    },
    routerBlock(routeObjectNode) {
        let tagName = routeObjectNode.tagName || "div", ifemptycomponent = routeObjectNode.ifemptycomponent || "", routerBlock = routeObjectNode.routerBlock, fakeNode = kix(null, ""), existNode = fakeNode, newRouteObjectNode = {
            [tagName]: [fakeNode, routerBlock],
            ...routeObjectNode,
        };
        delete newRouteObjectNode.tagName;
        delete newRouteObjectNode.ifemptycomponent;
        delete newRouteObjectNode.routerBlock;
        const node = kix(null, newRouteObjectNode);
        const resetRoute = () => {
            let exis_node = existNode.PreviousElement() || existNode.NextElement();
            if (exis_node && fakeNode != existNode) {
                existNode.Replace(fakeNode);
                existNode = fakeNode;
            }
            else if (!exis_node && fakeNode == existNode) {
                existNode.Replace(ifemptycomponent = kix(null, ifemptycomponent));
                existNode = ifemptycomponent;
            }
        };
        window.addEventListener("popstate", resetRoute);
        resetRoute();
        return node;
    },
    router(routerObjectNode) {
        const to = flatFunction(routerObjectNode.path), unic = flatFunction(routerObjectNode.unic), component = flatFunction(routerObjectNode.component), fakeNode = kix(null, ""), escapeRegexp = [/[\-{}\[\]+?.,\\\^$|#\s]/g, "\\$&"], toPath = (unic ? [
            escapeRegexp,
            [/:[^\s/]+/g, "([\\w-]+)"]
        ] : [
            escapeRegexp,
            [/\((.*?)\)/g, "(?:$1)?"],
            [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
            [/\*\w+/g, "(.*?)"]
        ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to), routeRegExp = new RegExp(unic ? toPath : "^" + toPath + "$", "i"), nodes = {}, createRouterNode = (ID) => {
            var loc_path = decodeURI(document.location.pathname), mathch_path = loc_path.match(routeRegExp) || [];
            to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (params[v] = mathch_path[i]));
            return routeRegExp.test(loc_path) ? nodes[ID] || (nodes[ID] = kix(null, component)) : fakeNode;
        };
        let existNode = createRouterNode();
        window.addEventListener("popstate", (function (e) {
            const newNode = createRouterNode((e.state || {}).ID);
            if (existNode != newNode) {
                existNode.Replace(newNode);
                existNode = newNode;
            }
        }));
        return existNode;
    }
};
exports.AttributeMethods = {
    getAttr(a) {
        return this.getAttribute(a);
    },
    setAttr(attribute, value) {
        value instanceof Function ?
            this.setAttr(attribute, value(this, attribute, objectPropertyRegistrator)) :
            (exports.AttributeMethods[attribute] ? this[attribute](value, attribute, this) : this.setAttribute(attribute, value));
        return this;
    },
    Select(query) {
        return query instanceof Array ?
            this.querySelectorAll(query.join(", ")) :
            this.querySelector(query);
    },
    Child(index) {
        const c = this.children;
        return index == undefined ? c : c[index];
    },
    Inner(innerString) {
        return innerString === undefined ?
            this.innerHTML :
            (typeof innerString === "string" ?
                ((this.innerHTML = innerString), this.firstChild) :
                (this.innerHTML = "", kix(this, innerString)));
    },
    Style(styleAttr) {
        styleAttr instanceof Object
            ?
                Object.assign(this.style, styleAttr) :
            styleAttr && this.setAttribute("style", String(styleAttr));
        return this.style;
    },
    e(eventsObject) {
        for (var eventNames in eventsObject) {
            for (var eventName of eventNames.split("_")) {
                this.addEventListener(eventName, eventsObject[eventName].bind(this));
            }
        }
        return this;
    },
    Parent(parentIndex) {
        let htmlNode = this, indexLocation = 0;
        parentIndex = parentIndex || 0;
        while (typeof parentIndex == "number" && indexLocation <= parentIndex) {
            htmlNode = htmlNode.parentNode;
            indexLocation++;
        }
        return htmlNode;
    },
    NextElement(nextElementIndex) {
        let nextNode = this;
        for (let i = 0; i <= (typeof nextElementIndex == "number" ? nextElementIndex : 0); i++) {
            nextNode = nextNode.nextElementSibling;
        }
        return nextNode;
    },
    PreviousElement(previousElementIndex) {
        let previousNode = this;
        for (var i = 0; i <= (typeof previousElementIndex == "number" ? previousElementIndex : 0); i++) {
            previousNode = previousNode.previousElementSibling;
        }
        return previousNode;
    },
    Append(childNode) {
        return kix(this, childNode);
    },
    Remove() {
        this.Parent().removeChild(this);
        return this;
    },
    Replace(replaceNode) {
        const parent = this.Parent();
        replaceNode = kix(null, flatFunction(replaceNode, this.Parent(), objectPropertyRegistrator));
        parent.replaceChild(replaceNode, this);
        return replaceNode;
    },
    Insert(method, node) {
        let parent = this.Parent(), HtmlNode = kix(null, flatFunction(node, parent, objectPropertyRegistrator));
        switch (method) {
            case "after":
                let n = this.nextSibling;
                if (n) {
                    parent.insertBefore(HtmlNode, n);
                    return HtmlNode;
                }
                else {
                    return parent.Append(node);
                }
            case "before":
                parent.insertBefore(HtmlNode, this);
                return HtmlNode;
        }
    },
    Restart() {
        let node = kix(null, flatFunction(this.KNode, this.Parent(), objectPropertyRegistrator));
        this.Replace(node);
        return node;
    },
};
Object.assign(Node.prototype, exports.AttributeMethods);
// Object.setPrototypeOf(AttributeMethods, Node.prototype)
// Object.setPrototypeOf(Node, AttributeMethods)
const fillArray = (node) => (node.hasOwnProperty(0) ? node : [""]);
const toArrayAndFill = (node) => node instanceof Array ? fillArray(node) : [node];
function replaceChildNodes(newValues, nod2, childIndex, nodeList, value, node) {
    while ((value = newValues[childIndex]), (node = nod2[childIndex]), ((childIndex < newValues.length) || (childIndex < nod2.length))) {
        if (value instanceof Array) {
            nodeList[childIndex] = replaceChildNodes(fillArray(value), [node], 0, []);
        }
        else if (node instanceof Array) {
            nodeList[childIndex] = replaceChildNodes([value], node, 0, [])[0];
        }
        else {
            if (node) {
                if (childIndex < newValues.length) {
                    value = flatFunction(value, node.parentNode);
                    if (node.KD_OBJECT === value) {
                        nodeList[childIndex] = last_node = node;
                    }
                    else {
                        nodeList[childIndex] = last_node = node.Replace(value);
                    }
                }
                else {
                    node.Remove();
                }
            }
            else if (childIndex < newValues.length) {
                nodeList[childIndex] = last_node = last_node.Insert("after", value);
            }
        }
        childIndex++;
    }
    ;
    return nodeList;
}
const objectPropertyRegistrator = (registrator) => {
    const RegisterNodes = {};
    let exitNodesOrAttributeNode;
    let attributeName;
    return (parent, isAttribute) => {
        let getValue = () => registrator((object, ...props) => {
            for (const prop of props) {
                const ifHaveObject = RegisterNodes[prop] || [];
                if (ifHaveObject.indexOf(object) === -1) {
                    let currentValue = object[prop];
                    const descriptor = Object.getOwnPropertyDescriptor(object, prop);
                    Object.defineProperty(object, prop, {
                        enumerable: true,
                        configurable: true,
                        get: () => typeof currentValue === "function" ? currentValue.bind(object) : currentValue,
                        set(newValue) {
                            currentValue = newValue;
                            (descriptor.set && descriptor.set(currentValue));
                            if (attributeName) {
                                exitNodesOrAttributeNode.setAttr(attributeName, getValue());
                            }
                            else {
                                let valuesss = toArrayAndFill(getValue());
                                exitNodesOrAttributeNode = replaceChildNodes(valuesss, exitNodesOrAttributeNode, 0, []);
                            }
                        }
                    });
                    ifHaveObject.push(object);
                }
                RegisterNodes[prop] = ifHaveObject;
                object = object[prop];
            }
            return object;
        });
        exitNodesOrAttributeNode = (attributeName = (typeof isAttribute === "string" && isAttribute)) ? parent : kix(parent, toArrayAndFill(getValue()));
        return attributeName ? getValue() : exitNodesOrAttributeNode;
    };
};
function createNodeApp(createElement) {
    const createKixElement = (objectNode, createdNode) => {
        for (var objectNodeProperty in objectNode) {
            if (createdNode) {
                createdNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            }
            else {
                if (exports.NodeMethods[objectNodeProperty]) {
                    return exports.NodeMethods[objectNodeProperty](objectNode, objectNodeProperty, createElement, createKixElement);
                }
                else {
                    createdNode = createElement(objectNodeProperty);
                    createdNode.KNode = objectNode;
                }
                Kix(createdNode, objectNode[objectNodeProperty]);
            }
        }
        return createdNode;
    };
    function Kix(parent, node) {
        switch (type(node)) {
            case "Array":
                return node.map((childNode) => Kix(parent, childNode));
            case "Function":
                return Kix(parent, node(parent, objectPropertyRegistrator));
            case "Object":
                node = createKixElement(node);
                break;
            case "Promise":
                node.then(function (result) {
                    node.Replace(result);
                });
            case "Undefined":
            case "Null":
            case "Boolean":
                node = "";
            case "Number":
            case "String":
            case "Date":
            case "RegExp":
            case "BigInt":
            case "Symbol":
            case "Error":
                const textNode = document.createTextNode(String(node));
                textNode.KNode = node;
                node = textNode;
                break;
        }
        return parent && parent.appendChild(node), node;
    }
    return Kix;
}
exports.createNodeApp = createNodeApp;
const createSvgNode = createNodeApp(createSvgElement);
const kix = createNodeApp(document.createElement.bind(document));
exports.style = kix(document.head, {
    style: "",
});
exports.default = kix;
