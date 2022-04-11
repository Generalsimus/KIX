"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = exports.routeParams = exports.Component = exports.styleCssDom = exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => ((tag === null || tag === void 0 ? void 0 : tag.__proto__.ELEMENT_NODE) === Node.ELEMENT_NODE);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const createSVGElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName);
const abstractNodes = {
    svg(objectNodeProperty, objectNode, createElementName, createElement) {
        return (parent) => {
            if (createElementName === createSVGElement) {
                objectNode = Object.assign({}, objectNode);
                const node = createSVGElement(objectNodeProperty);
                KixSVG(node, objectNode[objectNodeProperty]);
                delete objectNode[objectNodeProperty];
                return createElement(objectNode, node);
            }
            else {
                return KixSVG(parent, objectNode);
            }
        };
    },
    switch(objectNodeProperty, objectNode, createElementName, createElement) {
        let switchObjectNode = Object.assign({}, objectNode);
        const namedNode = createElementName("a");
        (0, exports.kix)(namedNode, switchObjectNode[objectNodeProperty]);
        delete switchObjectNode[objectNodeProperty];
        namedNode.e({
            click: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                const state = {
                    routeTime: new Date().getTime()
                };
                const routeEvent = new CustomEvent('popstate');
                history.pushState(state, document.title, this.getAttr("href"));
                window.dispatchEvent(routeEvent);
            },
        });
        return createElement(switchObjectNode, namedNode);
    },
    routing(_, routeObjectNode) {
        let currentNodes = (0, exports.kix)(null, ['']);
        const startMarker = (0, exports.kix)(null, '');
        const endMarker = (0, exports.kix)(null, '');
        const children = routeObjectNode.routing;
        const emptyComponent = flatFunction(routeObjectNode.ifEmptyComponent) || "";
        return [startMarker, currentNodes, children, endMarker, () => {
                let nextNode = startMarker;
                let renderComponent = emptyComponent;
                while (nextNode = nextNode.nextSibling) {
                    if (nextNode === endMarker)
                        break;
                    if (currentNodes.includes(nextNode) ||
                        (nextNode.nodeType === Node.TEXT_NODE &&
                            !nextNode.textContent.trim().length)) {
                        continue;
                    }
                    renderComponent = "";
                }
                replaceArrayNodes(currentNodes, [renderComponent], (currentNodes = []));
            }];
    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {
        let currentNodes = (0, exports.kix)(null, [""]);
        const to = flatFunction(path), uniqValue = flatFunction(unique), componentValue = flatFunction(component), escapeRegexp = [/[-[\]{}()*+!<=?.\/\\^$|#\s,]/g, "\\$&"], toPath = (uniqValue ? [
            escapeRegexp,
            [/\((.*?)\)/g, "(?:$1)?"],
            [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
            [/\*\w+/g, "(.*?)"]
        ] : [
            escapeRegexp,
            [/:[^\s/]+/g, "([\\w-]+)"]
        ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to), routeRegExp = new RegExp(uniqValue ? "^" + toPath + "$" : toPath, "i"), routeNodes = {}, createRouterNode = () => {
            const localPath = decodeURI(document.location.pathname);
            const matchPath = localPath.match(routeRegExp) || [];
            const preCurrentNodes = [];
            to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (exports.routeParams[v] = matchPath[i]));
            let renderComponent = "";
            if (routeRegExp.test(localPath)) {
                renderComponent = routeNodes[routeRegExp] || componentValue;
                routeNodes[routeRegExp] = preCurrentNodes;
            }
            replaceArrayNodes(currentNodes, [renderComponent], (currentNodes = preCurrentNodes));
        };
        window.addEventListener("popstate", createRouterNode);
        return [currentNodes, createRouterNode];
    },
    _R(objectNodeProperty, objectNode, createElementName, createElement) {
        return propertyRegistry(objectNode[objectNodeProperty]);
    },
    _F(objectNodeProperty, objectNode, createElementName, createElement) {
        var _a, _b;
        const component = objectNode._F;
        if (!(component instanceof Function))
            return;
        if ((_a = component.prototype) === null || _a === void 0 ? void 0 : _a.render) {
            class ComponentNode extends component {
                constructor() {
                    super();
                    const props = Object.assign(Object.assign({}, (objectNode.s || {})), registerProps(this, objectNode.d));
                    for (const propKey in props) {
                        this[propKey] = props[propKey];
                    }
                    this.children = objectNode.c || this.children;
                    this.render = this.render || (() => { });
                }
            }
            return new ComponentNode().render();
        }
        else if (((_b = Object.getOwnPropertyDescriptor(component, 'prototype')) === null || _b === void 0 ? void 0 : _b.writable) !== false) {
            const props = registerProps(Object.assign({}, (objectNode.s || {})), objectNode.d);
            const componentass = component(props);
            return componentass;
        }
    },
    _D(objectNodeProperty, objectNode, createElementName, createElement) {
        let node;
        for (const attributeName in objectNode) {
            if (node) {
                node[attributeName] = (tagNode) => (propertyRegistry(objectNode[attributeName])(tagNode, attributeName));
            }
            else {
                node = Object.assign({}, objectNode[attributeName]);
            }
        }
        return node;
    }
};
const abstractAttributes = {
    getAttr(a) {
        return this.getAttribute(a);
    },
    setAttr(attribute, value) {
        value = flatFunction(value, this, attribute);
        abstractAttributes[attribute] ? this[attribute](value, attribute) : this.setAttribute(attribute, value);
    },
    Append(childNode) {
        return (0, exports.kix)(this, childNode);
    },
    e(eventsObject) {
        for (var eventNames in eventsObject) {
            for (var eventName of eventNames.split("_")) {
                if (eventsObject[eventName] instanceof Function) {
                    this.addEventListener(eventName, eventsObject[eventName].bind(this));
                }
            }
        }
        return this;
    },
    Remove() {
        const parentNode = this.parentNode;
        parentNode && parentNode.removeChild(this);
        return this;
    },
    Replace(replaceNode) {
        let parent = this.parentNode;
        if (parent) {
            replaceNode = (0, exports.kix)(null, flatFunction(replaceNode, parent));
            if (replaceNode instanceof Array) {
                replaceArrayNodes([this], replaceNode, []);
            }
            else {
                parent === null || parent === void 0 ? void 0 : parent.replaceChild(replaceNode, this);
            }
            return replaceNode;
        }
        return this;
    },
    Insert(method, node) {
        const parent = this.parentNode, htmlMarker = (0, exports.kix)(null, "");
        if (!parent)
            return;
        switch (method) {
            case "after":
                const nextNode = this.nextSibling;
                if (nextNode) {
                    parent.insertBefore(htmlMarker, nextNode);
                }
                else {
                    parent.appendChild(htmlMarker);
                }
                break;
            case "before":
                parent.insertBefore(htmlMarker, this);
                break;
        }
        return htmlMarker.Replace(node);
    },
};
for (const key in abstractAttributes) {
    (Node.prototype[key] = abstractAttributes[key]);
}
function createApp(createElementName) {
    function createElement(objectNode, elementNode) {
        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            }
            else {
                if (abstractNodes.hasOwnProperty(objectNodeProperty)) {
                    const newNode = abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement);
                    return isHtml(newNode) ? (newNode.parentNode ? null : newNode) : newNode;
                }
                (0, exports.kix)((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
            }
        }
        return elementNode;
    }
    return function kix(parent, children) {
        switch (type(children)) {
            case "[object Array]":
                return children.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, children(parent));
            case "[object Object]":
                return kix(parent, createElement(children));
            case "[object Promise]":
                children.then((result) => children.Replace(result));
                return children = kix(parent, "");
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                children = "";
            default:
                if (!isHtml(children)) {
                    children = document.createTextNode(children + "");
                }
        }
        if (isHtml(parent)) {
            parent.appendChild(children);
        }
        return children;
    };
}
const KixSVG = createApp(createSVGElement);
exports.kix = createApp(document.createElement.bind(document));
exports.default = exports.kix;
exports.styleCssDom = (0, exports.kix)(document.body, { style: "" });
class Component {
    render() { }
}
exports.Component = Component;
exports.routeParams = {};
const useListener = (objectValue, propertyName, callback) => {
    let closed = false;
    let callBackList = [];
    const listenerService = {
        addCallback(callback) {
            if (callback instanceof Function) {
                callBackList.push(callback);
            }
            return listenerService;
        },
        removeCallback(callback) {
            callBackList = callBackList.filter(f => (f !== callback));
            return listenerService;
        },
        close() {
            closed = true;
        },
        open() {
            closed = false;
        }
    };
    const registerFunction = (r) => (r(objectValue, propertyName));
    ((registration(registerFunction, (value) => {
        if (closed)
            return;
        for (const callback of callBackList) {
            callback(value, propertyName);
        }
    }))());
    return listenerService.addCallback(callback);
};
exports.useListener = useListener;
function registration(registerFunction, onSet) {
    const getValue = () => (registerFunction(function () {
        return Array.prototype.reduce.call(arguments, (obj, key) => {
            var _a;
            let value = obj === null || obj === void 0 ? void 0 : obj[key];
            if (obj === null || obj === void 0 ? void 0 : obj.hasOwnProperty(key)) {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                const defineRegistrations = ((_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.set) === null || _a === void 0 ? void 0 : _a._R_C) || [];
                if (defineRegistrations.indexOf(registerFunction) === -1) {
                    defineRegistrations.push(registerFunction);
                    function set(setValue) {
                        value = setValue;
                        descriptor.set && descriptor.set(value);
                        onSet(value);
                    }
                    set._R_C = defineRegistrations;
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            return value;
                        },
                        set
                    });
                }
            }
            return typeof value === "function" ? value.bind(obj) : value;
        });
    }));
    return getValue;
}
function registerProps(props, registerProps) {
    for (const attrKey in (registerProps || {})) {
        const getValue = registration(registerProps[attrKey], () => {
            props[attrKey] = getValue();
        });
        props[attrKey] = getValue();
    }
    return props;
}
function replaceArrayNodes(currentNodes, replaceValues, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {
    replaceValues = replaceValues.length ? replaceValues : [""];
    while ((valuesIndex in replaceValues) || (nodeIndex in currentNodes)) {
        value = replaceValues[valuesIndex];
        node = currentNodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceArrayNodes(currentNodes, value, returnNodes, 0, nodeIndex)[0];
            valuesIndex++;
            continue;
        }
        else if (node instanceof Array) {
            valuesIndex = replaceArrayNodes(node, replaceValues, returnNodes, valuesIndex, 0)[1];
            nodeIndex++;
            continue;
        }
        let replacedNodes = [];
        if (node) {
            if (valuesIndex in replaceValues) {
                replacedNodes = node.Replace(value);
            }
            else {
                node.Remove();
            }
        }
        else {
            replacedNodes = returnNodes[returnNodes.length - 1].Insert("after", value);
        }
        if (replacedNodes instanceof Array) {
            returnNodes.push(...replacedNodes);
        }
        else {
            returnNodes.push(replacedNodes);
        }
        nodeIndex++;
        valuesIndex++;
    }
    return [nodeIndex, valuesIndex];
}
function propertyRegistry(registerFunction) {
    let currentNodes;
    return (parent, attribute) => {
        const getRenderValue = registration((a) => registerFunction(a), (value) => {
            if (attribute) {
                parent.setAttr(attribute, getRenderValue(parent, attribute));
            }
            else {
                replaceArrayNodes(currentNodes, [getRenderValue(parent, attribute)], (currentNodes = []));
            }
        });
        const value = getRenderValue();
        if (attribute) {
            return value;
        }
        currentNodes = (0, exports.kix)(parent, [value]);
    };
}
