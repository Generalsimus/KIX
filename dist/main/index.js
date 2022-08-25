"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = exports.createAttribute = exports.createElement = exports.Router = exports.Component = exports.styleCssDom = exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => ((tag === null || tag === void 0 ? void 0 : tag.__proto__.ELEMENT_NODE) === Node.ELEMENT_NODE);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const GlobalRouteParams = {};
const RoutePathParams = {};
const attributeNameForCatchDynamicNameAndEvents = " $_%^%_$";
const abstractNodes = {
    $(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const eventsGetFunc = objectNode["E"];
        const dynamicAttributesObject = objectNode["D"];
        const JsxElementObject = Object.assign(Object.assign({}, objectNode[objectPropertyName]), { [attributeNameForCatchDynamicNameAndEvents]: (htmlTagNode) => {
                delete JsxElementObject[attributeNameForCatchDynamicNameAndEvents];
                if (dynamicAttributesObject) {
                    for (const dynamicAttributeName in dynamicAttributesObject) {
                        const onChangeAttribute = (value) => {
                            if (htmlTagNode) {
                                setAttribute(htmlTagNode, dynamicAttributeName, value);
                            }
                            else {
                                JsxElementObject[dynamicAttributeName] = value;
                            }
                        };
                        onChangeAttribute(propertyRegistration(dynamicAttributesObject[dynamicAttributeName], onChangeAttribute));
                    }
                }
                if (eventsGetFunc) {
                    for (const eventName in eventsGetFunc()) {
                        if (htmlTagNode) {
                            htmlTagNode.addEventListener(eventName, (e) => {
                                const eventCallback = eventsGetFunc()[eventName];
                                if (typeof eventCallback === "function") {
                                    eventCallback(e, htmlTagNode);
                                }
                            });
                        }
                        else {
                            JsxElementObject["on" + eventName.replace(/^\w/, c => c.toUpperCase())] = (event, tagNode) => { var _a, _b; return ((_b = (_a = eventsGetFunc())[eventName]) === null || _b === void 0 ? void 0 : _b.call(_a, event, tagNode)); };
                        }
                    }
                }
            } });
        return JsxElementObject;
    },
    $C(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        var _a;
        const component = objectNode[objectPropertyName];
        const props = objectNode["a"] || {};
        const dynamicProps = objectNode["d"] || {};
        const componentChildren = objectNode["i"];
        if (!(component instanceof Function))
            return;
        const registerProps = (state) => {
            for (const propsName in props) {
                state[propsName] = props[propKey];
            }
            for (const dynamicPropsName in dynamicProps) {
                state[dynamicPropsName] = propertyRegistration(dynamicProps[dynamicPropsName], (value) => (state[dynamicPropsName] = value));
            }
        };
        if ((_a = component.prototype) === null || _a === void 0 ? void 0 : _a.render) {
            class ComponentNode extends component {
                constructor() {
                    super();
                    registerProps(this, dynamicProps);
                    this.children = componentChildren;
                    this.render = this.render || (() => { });
                }
            }
            return new ComponentNode().render();
        }
        else {
            const propsSate = {};
            registerProps(propsSate, dynamicProps);
            return component(propsSate);
        }
    },
    $X(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const JsxElement = objectNode[objectPropertyName];
        const defaultXmlnsNamespaceURI = objectNode["$D"];
        const xmlnsList = Object.assign({}, objectNode);
        delete xmlnsList["$X"];
        delete xmlnsList["$D"];
        if (defaultXmlnsNamespaceURI) {
            createElement = (elementName) => {
                return document.createElementNS(defaultXmlnsNamespaceURI, elementName);
            };
        }
        for (const xmlnsName in xmlnsList) {
            const createElementCache = createElement;
            const setAttributeCache = setAttribute;
            createElement = (elementName) => {
                if (elementName.startsWith(`${xmlnsName}:`)) {
                    return document.createElementNS(xmlnsList[xmlnsName], elementName);
                }
                return createElementCache(elementName);
            };
            setAttribute = (node, attributeName, value) => {
                if (attributeName.startsWith(`${xmlnsName}:`)) {
                    node.setAttributeNS(xmlnsList[xmlnsName], attributeName, value);
                }
                else {
                    return setAttributeCache(node, attributeName, value);
                }
            };
        }
        return createApp(createElement, setAttribute)(null, JsxElement);
    },
    $D(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const [startMarker, endMarker, ReplaceNode] = createMarker();
        return [
            startMarker,
            propertyRegistration(objectNode[objectPropertyName], ReplaceNode),
            endMarker
        ];
    },
    "route-link"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const renderJsxObject = Object.assign(Object.assign({ a: objectNode[objectPropertyName] }, objectNode), { [attributeNameForCatchDynamicNameAndEvents]: (htmlNode) => {
                htmlNode.addEventListener("click", (e) => {
                    e.preventDefault();
                    const state = {
                        routeTime: new Date().getTime()
                    };
                    window.history.pushState(state, document.title, htmlNode.getAttribute("href"));
                    window.dispatchEvent(new CustomEvent('popstate'));
                });
            } });
        delete renderJsxObject[objectPropertyName];
        return renderJsxObject;
    },
    "route-block"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const [startMarker, endMarker, _, getChildren] = createMarker();
        const [startMarkerEmptyMarker, endMarkerEmptyMarker, RenderEmptyMarker] = createMarker();
        const children = objectNode[objectPropertyName];
        const emptyComponent = objectNode.ifEmptyComponent;
        return [startMarker, children, endMarker, startMarkerEmptyMarker, endMarkerEmptyMarker, () => {
                const render = () => {
                    const children = getChildren();
                    console.log("🚀 --> file: index.js --> line 164 --> render --> children", children);
                    for (const htmlNode of children) {
                        const isTextNode = htmlNode.nodeType === Node.TEXT_NODE;
                        console.log("🚀 isTextNode", htmlNode, isTextNode && htmlNode.textContent.trim().length, !isTextNode);
                        if (isTextNode && htmlNode.textContent.trim().length || !isTextNode) {
                            RenderEmptyMarker("");
                            return;
                        }
                    }
                    RenderEmptyMarker(emptyComponent);
                };
                window.addEventListener("popstate", render);
                render();
            }];
    },
    "route-switch"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        var _a;
        (_a = objectNode[attributeNameForCatchDynamicNameAndEvents]) === null || _a === void 0 ? void 0 : _a.call(objectNode);
        let path;
        let unique;
        let component;
        let renderCache;
        let isRendered;
        const [startMarker, endMarker, Render, getChildren] = createMarker();
        const escapeRegExp = [/[-[\]{}()*+!<=?.\/\\^$|#\s,]/g, "\\$&"];
        const renderComponent = () => {
            const queryRegExpList = (unique ? [
                escapeRegExp,
                [/\((.*?)\)/g, "(?:$1)?"],
                [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
                [/\*\w+/g, "(.*?)"]
            ] : [
                escapeRegExp,
                [/:[^\s/]+/g, "([\\w-]+)"]
            ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), path);
            const queryRegExp = new RegExp(unique ? "^" + queryRegExpList + "$" : queryRegExpList, "i");
            const localPath = decodeURI(document.location.pathname);
            const matchPath = localPath.match(queryRegExp) || [];
            const pathParams = exports.Router.getPathParams(path);
            GlobalRouteParams;
            path.replace(/\/:/g, "/").match(queryRegExp).forEach((paramName, index) => {
                (GlobalRouteParams[paramName] = (pathParams[paramName] = matchPath[index]));
            });
            const isRunAfterRender = isRendered;
            isRendered = true;
            if (!queryRegExp.test(localPath)) {
                if (isRunAfterRender) {
                    Render("");
                }
                return "";
            }
            if (isRunAfterRender) {
                Render(renderCache || component);
            }
            setTimeout(() => {
                renderCache = getChildren();
            });
            return component;
        };
        window.addEventListener("popstate", renderComponent);
        (0, exports.useListener)(objectNode, "path", (value) => {
            path = value;
        }).init().addCallback(renderComponent);
        (0, exports.useListener)(objectNode, "unique", (value) => {
            unique = value;
        }).init().addCallback(renderComponent);
        (0, exports.useListener)(objectNode, "component", (value) => {
            component = value;
        }).init().addCallback(renderComponent);
        return [startMarker, renderComponent, endMarker];
    },
};
const abstractAttributes = {
    [attributeNameForCatchDynamicNameAndEvents](node, attributeName, value, setAttribute) {
        value(node);
    }
};
function createApp(createElementName, setAttribute) {
    const setAttributeTagNode = (node, attributeName, value) => {
        if (abstractAttributes.hasOwnProperty(attributeName)) {
            abstractAttributes[attributeName](node, attributeName, value, setAttributeTagNode);
        }
        else if (value instanceof Function) {
            setAttributeTagNode(node, value(node), attributeName);
        }
        else {
            setAttribute(node, attributeName, String(value !== null && value !== void 0 ? value : ""));
        }
    };
    function createObjectElement(objectNode, elementNode) {
        for (const objectPropertyName in objectNode) {
            if (elementNode) {
                setAttributeTagNode(elementNode, objectPropertyName, objectNode[objectPropertyName]);
            }
            else {
                if (abstractNodes.hasOwnProperty(objectPropertyName)) {
                    return abstractNodes[objectPropertyName](objectNode, objectPropertyName, kix, createElementName, setAttributeTagNode, createObjectElement);
                }
                kix((elementNode = createElementName(objectPropertyName)), objectNode[objectPropertyName]);
            }
        }
        return elementNode;
    }
    const kix = (parent, children) => {
        switch (type(children)) {
            case "[object Array]":
                return children.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, children(parent));
            case "[object Object]":
                return kix(parent, createObjectElement(children));
            case "[object Promise]":
                const [startMarker, endMarker, Render] = createMarker();
                children.then((result) => Render(result));
                return kix(parent, [startMarker, endMarker]);
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
    return kix;
}
let registrationId = 0;
const propertyRegistration = (registrationFunc, callback = () => { }) => {
    const currentRegistrationId = ++registrationId;
    const getValue = () => registrationFunc(function () {
        const ARGUMENTS = arguments;
        const registers = [];
        return Array.prototype.reduce.call(ARGUMENTS, (prevValue, propertyKey, index) => {
            if (prevValue === undefined)
                return prevValue;
            if (typeof prevValue === "object") {
                register(prevValue, propertyKey, registers, index, currentRegistrationId, () => {
                    callback(getValue());
                });
            }
            return prevValue === null || prevValue === void 0 ? void 0 : prevValue[propertyKey];
        });
    });
    return getValue();
};
const register = (obj, key, registers, index, currentRegistrationId, changeCallback) => {
    let { set, get, value, configurable } = Object.getOwnPropertyDescriptor(obj, key) || {};
    const idList = (set === null || set === void 0 ? void 0 : set._$IDS) || [];
    if (!idList.includes(currentRegistrationId) && configurable !== false) {
        idList.push(currentRegistrationId);
        registers[index] = idList;
        const getCurrentValue = () => (get ? get() : value);
        const setter = (setValue) => {
            if (set) {
                set(setValue);
            }
            else {
                value = setValue;
            }
            if (idList.includes(currentRegistrationId)) {
                if (typeof newValue === "object" && oldValue !== newValue) {
                }
                changeCallback();
            }
        };
        setter === null || setter === void 0 ? void 0 : setter._$IDS = idList;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: get || getCurrentValue,
            set: setter
        });
    }
};
const createMarker = () => {
    const startMarker = (0, exports.kix)(null, "");
    const endMarker = (0, exports.kix)(null, "");
    const replaceNodes = (sibling, replaceNode, currentNodes) => {
        if (replaceNode instanceof Array) {
            for (const childNode of replaceNode) {
                sibling = replaceNodes(sibling, childNode, currentNodes);
            }
        }
        else {
            const parent = sibling.parentNode;
            const replaceableNode = (0, exports.kix)(null, flatFunction(replaceNode, parent));
            if (replaceableNode instanceof Array) {
                return replaceNodes(sibling, replaceableNode, currentNodes);
            }
            else if (sibling === endMarker) {
                parent.insertBefore(replaceableNode, endMarker);
            }
            else {
                parent.replaceChild(replaceableNode, sibling);
                sibling = replaceableNode.nextSibling;
            }
            currentNodes.push(replaceableNode);
        }
        return sibling;
    };
    return [
        startMarker,
        endMarker,
        (replaceNode) => {
            const currentNodes = [];
            const startIndex = startMarker.nextSibling;
            let sibling = replaceNodes(startIndex, replaceNode, currentNodes);
            const parent = sibling.parentNode;
            while (sibling && sibling !== endMarker) {
                const nextSibling = sibling.nextSibling;
                parent.removeChild(sibling);
                sibling = nextSibling;
            }
            return currentNodes;
        },
        (currentNodes = [], sibling = startMarker) => {
            while ((sibling = sibling.nextSibling) && sibling !== endMarker) {
                currentNodes.push(sibling);
            }
            return currentNodes;
        }
    ];
};
exports.kix = createApp((elementName) => document.createElement(elementName), (node, attributeName, value) => node.setAttribute(attributeName, value));
exports.default = exports.kix;
exports.styleCssDom = (0, exports.kix)(document.body, { style: "" });
class Component {
    render() { }
}
exports.Component = Component;
exports.Router = {
    getPathParams(path) {
        return RoutePathParams[path] || (RoutePathParams[path] = {});
    },
    getGlobalParams() {
        return GlobalRouteParams;
    },
    history: window.history
};
const createElement = (tagName, renderCallback) => {
    abstractNodes[tagName] = renderCallback;
};
exports.createElement = createElement;
const createAttribute = (attributeName, renderCallback, autoSet) => {
    abstractAttributes[attributeName] = (node, attributeName, value, setAttribute) => {
        const value = renderCallback(node, attributeName, value, setAttribute);
        if (autoSet) {
            setAttribute(node);
        }
    };
};
exports.createAttribute = createAttribute;
const useListener = (objectValue, propertyName, callback) => {
    const createCallbackChannel = (childCallback = () => { }) => {
        let isOpen = false;
        const listenerService = {
            addCallback(newCallback) {
                const parentCallback = childCallback;
                childCallback = () => {
                    if (isOpen) {
                        parentCallback(currentValue, propertyName, objectValue);
                        newCallback(currentValue, propertyName, objectValue);
                    }
                };
                return listenerService;
            },
            addChildListener(newCallback) {
                const childChannel = createCallbackChannel(newCallback);
                const parentCallback = childCallback;
                childCallback = () => {
                    if (isOpen) {
                        parentCallback(currentValue, propertyName, objectValue);
                        childChannel.init(currentValue, propertyName, objectValue);
                    }
                };
                return childChannel;
            },
            close() {
                isOpen = false;
                return listenerService;
            },
            isOpen() {
                return isOpen;
            },
            open() {
                isOpen = true;
                return listenerService;
            },
            init() {
                childCallback(currentValue, propertyName, objectValue);
                return listenerService;
            }
        };
        return listenerService;
    };
    const channel = createCallbackChannel(callback);
    let currentValue = propertyRegistration((r) => (r(objectValue, propertyName)), (value) => {
        currentValue = value;
        channel.init();
    });
    return channel;
};
exports.useListener = useListener;
