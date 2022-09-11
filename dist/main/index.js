"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = exports.createAttribute = exports.createElement = exports.Router = exports.Component = exports.styleCssDom = exports.kix = void 0;
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => ((tag === null || tag === void 0 ? void 0 : tag.__proto__.ELEMENT_NODE) === Node.ELEMENT_NODE);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const GlobalRouteParams = {};
const RoutePathParams = {};
const kixUniqueAppUsableKey = `$_%^${Math.random()}}^%_$`;
const WindowObject = window;
const abstractNodes = {
    $(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const eventsGetFunc = objectNode["E"];
        const dynamicAttributesObject = objectNode["D"];
        const JsxElementObject = Object.assign(Object.assign({}, objectNode[objectPropertyName]), { [kixUniqueAppUsableKey]: (htmlTagNode) => {
                delete JsxElementObject[kixUniqueAppUsableKey];
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
                state[propsName] = props[propsName];
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
            const propsSate = { children: componentChildren };
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
            propertyRegistration(objectNode[objectPropertyName], (v) => (ReplaceNode(v))),
            endMarker
        ];
    },
    "route-link"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const renderJsxObject = Object.assign(Object.assign({ a: objectNode[objectPropertyName] }, objectNode), { [kixUniqueAppUsableKey]: (htmlNode) => {
                var _a;
                (_a = objectNode[kixUniqueAppUsableKey]) === null || _a === void 0 ? void 0 : _a.call(objectNode, htmlNode);
                htmlNode.addEventListener("click", (e) => {
                    e.preventDefault();
                    WindowObject.history.pushState({ routeTime: new Date().getTime() }, document.title, htmlNode.getAttribute("href"));
                    WindowObject.dispatchEvent(new CustomEvent('popstate'));
                });
            } });
        delete renderJsxObject[objectPropertyName];
        return renderJsxObject;
    },
    "route-block"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const [startMarker, endMarker, _, getChildren] = createMarker();
        const [startMarkerEmptyMarker, endMarkerEmptyMarker, RenderEmptyMarker, getRenderedChildren] = createMarker();
        const children = objectNode[objectPropertyName];
        let emptyComponent;
        let renderedEmptyComponent;
        let currentComponent;
        const render = () => {
            const children = getChildren();
            for (const htmlNode of children) {
                const isTextNode = htmlNode.nodeType === Node.TEXT_NODE;
                if (!isTextNode || (isTextNode && htmlNode.textContent.trim().length)) {
                    return currentComponent = "";
                }
            }
            currentComponent = emptyComponent;
            return [renderedEmptyComponent || emptyComponent, () => {
                    renderedEmptyComponent = getRenderedChildren();
                }];
        };
        const renderComponent = () => {
            let prevComponent = currentComponent;
            let newComponent = render();
            if (prevComponent !== currentComponent) {
                RenderEmptyMarker(newComponent);
            }
        };
        (0, exports.useListener)(objectNode, "ifEmptyComponent", (value) => {
            renderedEmptyComponent = undefined;
            emptyComponent = value;
        }).init().addCallback(renderComponent);
        WindowObject.addEventListener(kixUniqueAppUsableKey, renderComponent);
        return [
            startMarker,
            children,
            endMarker,
            startMarkerEmptyMarker,
            render,
            endMarkerEmptyMarker,
        ];
    },
    "route-switch"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        var _a;
        (_a = objectNode[kixUniqueAppUsableKey]) === null || _a === void 0 ? void 0 : _a.call(objectNode);
        let path;
        let unique;
        let component;
        let renderedComponent;
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
            path.replace(/\/:/g, "/").match(queryRegExp).forEach((paramName, index) => {
                (GlobalRouteParams[paramName] = (pathParams[paramName] = matchPath[index]));
            });
            if (!queryRegExp.test(localPath)) {
                return "";
            }
            setTimeout(() => {
                renderedComponent = getChildren();
            });
            return renderedComponent || component;
        };
        const resetComponent = () => (Render(renderComponent()), WindowObject.dispatchEvent(new CustomEvent(kixUniqueAppUsableKey)));
        WindowObject.addEventListener("popstate", resetComponent);
        (0, exports.useListener)(objectNode, "path", (value) => {
            path = value;
        }).init().addCallback(resetComponent);
        (0, exports.useListener)(objectNode, "unique", (value) => {
            unique = value;
        }).init().addCallback(resetComponent);
        (0, exports.useListener)(objectNode, "component", (value) => {
            renderedComponent = undefined;
            component = value;
        }).init().addCallback(resetComponent);
        return [startMarker, renderComponent, endMarker];
    },
};
const abstractAttributes = {
    [kixUniqueAppUsableKey](node, attributeName, value, setAttribute) {
        value(node);
    }
};
function createApp(createElementName, setAttribute) {
    const setAttributeTagNode = (node, attributeName, value) => {
        if (abstractAttributes.hasOwnProperty(attributeName)) {
            abstractAttributes[attributeName](node, attributeName, value, setAttribute);
        }
        else if (value instanceof Function) {
            setAttributeTagNode(node, attributeName, value(node));
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
            const value = prevValue === null || prevValue === void 0 ? void 0 : prevValue[propertyKey];
            if (typeof value === "function") {
                return value.bind(prevValue);
            }
            return value;
        });
    });
    return getValue();
};
const register = (obj, key, registers, index, currentRegistrationId, changeCallback) => {
    let descriptor = Object.getOwnPropertyDescriptor(obj, key);
    let { set, get, value, configurable } = descriptor || {};
    const idList = (set === null || set === void 0 ? void 0 : set._$IDS) || [];
    if (!idList.includes(currentRegistrationId) && configurable !== false) {
        idList.push(currentRegistrationId);
        registers[index] = idList;
        if (!descriptor) {
            value = obj[key];
        }
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
        setter._$IDS = idList;
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
    const replaceNodes = (sibling, replaceNode) => {
        if (replaceNode instanceof Array) {
            for (const childNode of replaceNode) {
                sibling = replaceNodes(sibling, childNode);
            }
        }
        else {
            const parent = sibling.parentNode;
            const replaceableNode = (0, exports.kix)(null, flatFunction(replaceNode, parent));
            if (replaceableNode instanceof Array) {
                return replaceNodes(sibling, replaceableNode);
            }
            else if (sibling === endMarker) {
                parent.insertBefore(replaceableNode, endMarker);
            }
            else {
                parent.replaceChild(replaceableNode, sibling);
                sibling = replaceableNode.nextSibling;
            }
        }
        return sibling;
    };
    const renderNodes = (replaceNode) => {
        const startSibling = startMarker.nextSibling;
        if (!startSibling)
            return;
        let sibling = replaceNodes(startSibling, replaceNode);
        const parent = sibling.parentNode;
        while (sibling && sibling !== endMarker) {
            const nextSibling = sibling.nextSibling;
            parent.removeChild(sibling);
            sibling = nextSibling;
        }
    };
    return [
        startMarker,
        endMarker,
        renderNodes,
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
    history: WindowObject.history
};
const createElement = (tagName, renderCallback) => {
    abstractNodes[tagName] = (objectNode, tagName, kix, createElement, setAttribute, createObjectElement) => {
        var _a;
        (_a = objectNode[kixUniqueAppUsableKey]) === null || _a === void 0 ? void 0 : _a.call(objectNode);
        return renderCallback(objectNode, tagName, kix, createElement, setAttribute, createObjectElement);
    };
};
exports.createElement = createElement;
const createAttribute = (attributeName, renderCallback, autoSet) => {
    abstractAttributes[attributeName] = (node, attributeName, value, setAttribute) => {
        const setValue = renderCallback(node, attributeName, value, setAttribute);
        if (autoSet) {
            setAttribute(node, attributeName, setValue);
        }
    };
};
exports.createAttribute = createAttribute;
const useListener = (objectValue, propertyName, callback = () => { }) => {
    const createCallbackChannel = (childCallback = () => { }) => {
        let isOpen = true;
        const listenerService = {
            addCallback: (newCallback) => {
                const parentCallback = childCallback;
                childCallback = () => {
                    parentCallback(currentValue, propertyName, objectValue);
                    newCallback(currentValue, propertyName, objectValue);
                };
                return listenerService;
            },
            addChildListener: (newCallback) => {
                const childChannel = createCallbackChannel(newCallback);
                const parentCallback = childCallback;
                childCallback = () => {
                    parentCallback(currentValue, propertyName, objectValue);
                    if (childChannel.isOpen()) {
                        childChannel.init(currentValue, propertyName, objectValue);
                    }
                };
                return childChannel;
            },
            close: () => {
                isOpen = false;
                return listenerService;
            },
            isOpen: () => {
                return isOpen;
            },
            open: () => {
                isOpen = true;
                return listenerService;
            },
            init: () => {
                childCallback(currentValue, propertyName, objectValue);
                return listenerService;
            },
            getValue: () => currentValue
        };
        return listenerService;
    };
    const channel = createCallbackChannel(callback);
    let currentValue = propertyRegistration((r) => (r(objectValue, propertyName)), (value) => {
        currentValue = value;
        if (channel.isOpen()) {
            channel.init();
        }
    });
    return channel;
};
exports.useListener = useListener;
