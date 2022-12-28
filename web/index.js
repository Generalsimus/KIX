const SETTER_ID_KEY = "_$IDS";
const KIX_UNIQUE_APP_USABLE_KEY = Math.random() + SETTER_ID_KEY;
const NODE_UNMOUNT_FUNCTION_KEY = KIX_UNIQUE_APP_USABLE_KEY + SETTER_ID_KEY;
const NODE_MOUNT_FUNCTION_KEY = NODE_UNMOUNT_FUNCTION_KEY + SETTER_ID_KEY;
const NODE_MOUNT_VALUE_KEY = NODE_MOUNT_FUNCTION_KEY + SETTER_ID_KEY;
const WindowObject = window;
const DocumentObject = WindowObject.document;
const GlobalRouteParams = {};
const RoutePathParams = {};
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => (tag?.__proto__?.ELEMENT_NODE === Node.ELEMENT_NODE);
const createMarker = () => DocumentObject.createTextNode("");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const abstractNodes = {
    $(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const eventsGetFunc = objectNode["E"];
        const dynamicAttributesObject = objectNode["D"];
        const JsxElementObject = {
            ...objectNode[objectPropertyName],
            [KIX_UNIQUE_APP_USABLE_KEY]: (htmlTagNode) => {
                delete JsxElementObject[KIX_UNIQUE_APP_USABLE_KEY]
                if (dynamicAttributesObject) {
                    for (const dynamicAttributeName in dynamicAttributesObject) {
                        const onChangeAttribute = (value) => {
                            if (htmlTagNode) {
                                setAttribute(htmlTagNode, dynamicAttributeName, value);
                            } else {
                                JsxElementObject[dynamicAttributeName] = value;
                            }
                        }
                        onChangeAttribute(
                            propertyRegistration(dynamicAttributesObject[dynamicAttributeName], onChangeAttribute)
                        );

                    }
                }

                if (eventsGetFunc) {
                    for (const eventName in eventsGetFunc()) {
                        if (htmlTagNode) {
                            htmlTagNode.addEventListener(eventName, (e) => {
                                const eventCallback = eventsGetFunc()[eventName]
                                if (typeof eventCallback === "function") {
                                    eventCallback(e, htmlTagNode);
                                }
                            });
                        } else {
                            JsxElementObject["on" + eventName.replace(/^\w/, c => c.toUpperCase())] = (event, tagNode) => (eventsGetFunc()[eventName]?.(event, tagNode));
                        }
                    }

                }
            }
        }
        return JsxElementObject
    },
    $C(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const component = objectNode[objectPropertyName];
        const props = objectNode["a"] || {};
        const dynamicProps = objectNode["d"] || {};
        const componentChildren = objectNode["i"];

        if (!(component instanceof Function)) return;

        const registerProps = (state) => {
            for (const propsName in props) {
                state[propsName] = props[propsName];
            }

            for (const dynamicPropsName in dynamicProps) {
                state[dynamicPropsName] = propertyRegistration(dynamicProps[dynamicPropsName], (value) => (state[dynamicPropsName] = value))
            }
        }

        if (component.prototype?.render) {
            class ComponentNode extends component {
                constructor() {
                    super();
                    registerProps(this, dynamicProps);

                    this.children = componentChildren
                    this.render = this.render || (() => { })
                }
            }
            return new ComponentNode().render();
        } else {
            const propsSate = { children: componentChildren };
            registerProps(propsSate, dynamicProps);
            return component(propsSate);
        }
    },
    $X(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {

        const JsxElement = objectNode[objectPropertyName];
        const defaultXmlnsNamespaceURI = objectNode["$D"]
        const xmlnsList = { ...objectNode };
        delete xmlnsList["$X"];
        delete xmlnsList["$D"];
        if (defaultXmlnsNamespaceURI) {
            createElement = (elementName) => {

                return DocumentObject.createElementNS(defaultXmlnsNamespaceURI, elementName);
            }
        }

        for (const xmlnsName in xmlnsList) {
            const createElementCache = createElement;
            const setAttributeCache = setAttribute;
            createElement = (elementName) => {
                if (elementName.startsWith(`${xmlnsName}:`)) {
                    return DocumentObject.createElementNS(xmlnsList[xmlnsName], elementName);
                }
                return createElementCache(elementName);
            }
            setAttribute = (node, attributeName, value) => {
                if (attributeName.startsWith(`${xmlnsName}:`)) {
                    node.setAttributeNS(xmlnsList[xmlnsName], attributeName, value);
                } else {
                    return setAttributeCache(node, attributeName, value);
                }
            }
        }


        return createApp(createElement, setAttribute)(null, JsxElement);
    },
    $D(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const [markers, Render] = createSpaceController()

        return [
            markers,
            () => Render(propertyRegistration(
                objectNode[objectPropertyName],
                (renderElement) => Render(renderElement)
            )),
        ]
    },
    "route-link"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {

        const renderJsxObject = {
            a: objectNode[objectPropertyName],
            ...objectNode,
            [KIX_UNIQUE_APP_USABLE_KEY]: (htmlNode) => {
                objectNode[KIX_UNIQUE_APP_USABLE_KEY]?.(htmlNode);
                htmlNode.addEventListener("click", (e) => {
                    e.preventDefault();
                    WindowObject.history.pushState({ routeTime: new Date().getTime() }, DocumentObject.title, htmlNode.getAttribute("href"));
                    WindowObject.dispatchEvent(new CustomEvent('popstate'));

                    const { routeScroll } = objectNode
                    if (routeScroll === undefined || routeScroll) {
                        WindowObject.scrollTo(0, 0);
                    }
                })
            }
        }
        delete renderJsxObject[objectPropertyName]
        return renderJsxObject;
    },
    "route-block"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        const [markers, Render] = createSpaceController()
        const startMarker = createMarker()
        const endMarker = createMarker()
        // console.log("🚀 --> file: index.js:164 --> endMarker", endMarker);
        const renderComponent = () => {
            let { ifEmptyComponent } = objectNode
            let markerNode = startMarker;
            while (markerNode && markerNode !== endMarker) {
                const isTextNode = markerNode.nodeType === Node.TEXT_NODE;
                if (!isTextNode || (isTextNode && markerNode.textContent.trim().length)) {
                    ifEmptyComponent = ""
                    break;
                }
                markerNode = markerNode.nextSibling
            }
            Render(ifEmptyComponent)
        }


        useObjectListener(objectNode, renderComponent)

        WindowObject.addEventListener(KIX_UNIQUE_APP_USABLE_KEY, renderComponent);

        return [
            markers,
            startMarker,
            objectNode[objectPropertyName],
            endMarker,
            renderComponent,
        ];
    },
    "route-switch"(objectNode, objectPropertyName, kix, createElement, setAttribute, createObjectElement) {
        objectNode[KIX_UNIQUE_APP_USABLE_KEY]?.();

        const escapeRegExp = [/[-[\]{}()*+!<=?.\/\\^$|#\s,]/g, "\\$&"];
        const renderComponent = () => {
            const { path, unique, component } = objectNode
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
            const localPath = decodeURI(DocumentObject.location.pathname);
            const matchPath = localPath.match(queryRegExp) || [];
            const pathParams = Router.getPathParams(path);

            path.replace(/\/:/g, "/").match(queryRegExp).forEach((paramName, index) => {
                GlobalRouteParams[paramName] = pathParams[paramName] = matchPath[index]
            });

            Render(queryRegExp.test(localPath) ? component : "");
        }
        const resetComponentEvent = () => {
            renderComponent()
            WindowObject.dispatchEvent(new CustomEvent(KIX_UNIQUE_APP_USABLE_KEY));
        }
        const [markers, Render] = createSpaceController();

        useObjectListener(objectNode, resetComponentEvent);
        WindowObject.addEventListener("popstate", resetComponentEvent);

        return [markers, renderComponent];
    },
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const abstractAttributes = {
    [KIX_UNIQUE_APP_USABLE_KEY](node, attributeName, value, setAttribute) {
        value(node);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createApp(createElementName, setAttribute) {

    const setAttributeTagNode = (node, attributeName, value) => {
        if (abstractAttributes.hasOwnProperty(attributeName)) {
            abstractAttributes[attributeName](node, attributeName, value, setAttribute);
        } else if (value instanceof Function) {
            setAttributeTagNode(node, attributeName, value(node));
        } else {
            setAttribute(node, attributeName, String(value ?? ""));
        }
    }

    function createObjectElement(parent, objectNode, elementNode) {

        for (const objectPropertyName in objectNode) {
            if (elementNode) {
                setAttributeTagNode(elementNode, objectPropertyName, objectNode[objectPropertyName]);
            } else {
                if (objectPropertyName in abstractNodes) {
                    return kix(
                        parent,
                        abstractNodes[objectPropertyName](objectNode, objectPropertyName, kix, createElementName, setAttributeTagNode, createObjectElement)
                    )
                }

                kix((elementNode = createElementName(objectPropertyName)), objectNode[objectPropertyName]);
            }

        }

        return (isHtml(parent) && parent.appendChild(elementNode)), elementNode
    }

    const kix = (parent, children) => {

        switch (type(children)) {
            case "[object Array]":
                return children.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, children(parent));
            case "[object Object]":
                return createObjectElement(parent, children)
            case "[object Promise]":
                const [markers, Render] = createSpaceController();

                children.then((result) => Render(storage, result));

                return kix(parent, markers);
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                children = ""
            default:
                if (!isHtml(children)) {
                    children = DocumentObject.createTextNode(children + "");
                }

        }


        return (isHtml(parent) && parent.appendChild(children)), children
    }
    return kix
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let INC_REGiSTER_ID = 0
const removePropsCallback = (id, value, startIndex, args) => {
    for (let index = startIndex + 1; index < args.length; ++index) {
        if (typeof value === "object") {
            const property = args[index];
            const setterObject = Object.getOwnPropertyDescriptor(value, property)?.set?.[SETTER_ID_KEY];
            if (setterObject) {
                delete setterObject[id]
            }
            value = value?.[property]
        }
    }
}
const registerKeyProperty = (args, index, id, object, property, { get, set, configurable }, callback) => {
    let value = object?.[property]
    const setterObject = { [id]: callback };
    if (configurable !== false) {
        get = (get || (() => value));
        const setter = (setValue) => {
            if (set) {
                set(setValue)
            }
            if (value !== setValue) {
                removePropsCallback(id, value, index, args)
            }
            value = setValue
            for (const keyId in setterObject) {
                setterObject[keyId]()
            }
        }
        setter[SETTER_ID_KEY] = setterObject
        Object.defineProperty(object, property, {
            enumerable: true,
            configurable: true,
            get: get,
            set: setter
        });
    }
    return value
}
const propertyRegistration = (register, callback) => {
    const id = INC_REGiSTER_ID++
    const resetCall = () => callback(getValue())
    const getValue = () => register(function () {
        return Array.prototype.reduce.call(arguments, (prevValue, property, index) => {
            let value = prevValue?.[property]
            if (typeof prevValue === "object") {
                const descriptor = Object.getOwnPropertyDescriptor(prevValue, property)
                const setterObject = descriptor?.set?.[SETTER_ID_KEY]
                if (setterObject) {
                    setterObject[id] = resetCall
                } else if (descriptor) {
                    value = registerKeyProperty(arguments, index, id, prevValue, property, descriptor, resetCall)
                }
            }
            return typeof value === "function" ? value.bind(prevValue) : value
        })
    })

    return getValue()
}
//////////////////////////////////////////////////////////////////////////////_////////////////////////////////

const loopEachItems = (items, callback) => {
    if (items instanceof Array) {
        for (const item of items) {
            loopEachItems(item, callback);
        }
    } else {
        callback(items);
    }
}

const createSpaceController = () => {
    const startMarker = createMarker();
    const endMarker = createMarker();
    //  createMarker();
    //  DocumentObject.createTextNode("START_|");
    //  DocumentObject.createTextNode("|_END"); 
    const storage = new Map();
    let currentNode = startMarker
    const getNodeCachedSet = (node) => {
        let cachedSet = storage.get(node)
        return cachedSet || ((storage.set(node, (cachedSet = new Set()))), cachedSet)
    }
    const removeUnusedNodes = () => {
        while (currentNode !== endMarker) {
            const nextSibling = currentNode.nextSibling;
            currentNode.remove();
            currentNode[NODE_UNMOUNT_FUNCTION_KEY]?.();
            currentNode = nextSibling;
        }
    }
    const replace = (node, parentDomNode) => {
        if (node instanceof Array) {
            for (const item of node) {
                replace(item, parentDomNode)
            }
        } else if (node instanceof Function) {
            replace(node(parentDomNode), parentDomNode)
        } else if (currentNode[NODE_MOUNT_VALUE_KEY] !== node) {
            removeUnusedNodes();
            const cached = getNodeCachedSet(node);
            if (cached.size === 0) {
                cached.add(kix(null, node))
            }
            for (const mountDomNode of cached) {
                cached.delete(mountDomNode)
                const unmount = () => cached.add(mountDomNode)
                loopEachItems(mountDomNode, (domNode) => {
                    domNode[NODE_UNMOUNT_FUNCTION_KEY] = unmount;
                    domNode[NODE_MOUNT_VALUE_KEY] = node;
                    parentDomNode.insertBefore(domNode, endMarker);
                    domNode[NODE_MOUNT_FUNCTION_KEY]?.();
                })
                break
            }
        } else {
            currentNode = currentNode.nextSibling || startMarker;
        }
    }
    const Render = (node) => {

        const parentNode = startMarker.parentNode;
        if (parentNode) {
            currentNode = startMarker.nextSibling;
            replace(node, parentNode);
            removeUnusedNodes();
        } else {
            endMarker[NODE_MOUNT_FUNCTION_KEY] = () => {
                currentNode = startMarker.nextSibling;
                replace(node, startMarker.parentNode);
                removeUnusedNodes();
            }

        }
    }
    return [
        [startMarker, endMarker],
        Render,
    ]
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const kix = createApp(
    (elementName) => DocumentObject.createElement(elementName),
    (node, attributeName, value) => node.setAttribute(attributeName, value)
);
export default kix;
export class Component { render() { } }
export const Router = {
    getPathParams(path) {
        return RoutePathParams[path] || (RoutePathParams[path] = {})
    },
    getGlobalParams() {
        return GlobalRouteParams
    },
    history: WindowObject.history
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createElement = (tagName, renderCallback) => {
    abstractNodes[tagName] = (objectNode, tagName, kix, createElement, setAttribute, createObjectElement) => {
        objectNode[KIX_UNIQUE_APP_USABLE_KEY]?.();
        return renderCallback(objectNode, tagName, kix, createElement, setAttribute, createObjectElement)
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createAttribute = (attributeName, renderCallback, autoSet) => {
    abstractAttributes[attributeName] = (node, attributeName, value, setAttribute) => {
        const setValue = renderCallback(node, attributeName, value, setAttribute)
        if (autoSet) {
            setAttribute(node, attributeName, setValue);
        }
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useListener = (objectValue, propertyName, callback = () => { }) => {
    const createCallbackChannel = (childCallback = () => { }) => {
        let isOpen = true;
        const listenerService = {
            addCallback: (newCallback) => {
                const parentCallback = childCallback;
                childCallback = () => {
                    parentCallback(currentValue, propertyName, objectValue);
                    newCallback(currentValue, propertyName, objectValue);
                };
                return listenerService
            },
            addChildListener: (newCallback) => {
                const childChannel = createCallbackChannel(newCallback);
                const parentCallback = childCallback;
                childCallback = () => {
                    parentCallback(currentValue, propertyName, objectValue);
                    if (childChannel.isOpen()) {
                        childChannel.init();
                    }
                };
                return childChannel
            },
            close: () => {
                isOpen = false
                return listenerService
            },
            isOpen: () => {
                return isOpen
            },
            open: () => {
                isOpen = true
                return listenerService
            },
            init: () => {
                childCallback(currentValue, propertyName, objectValue);
                return listenerService
            },
            getValue: () => currentValue
        }
        return listenerService;
    }
    const channel = createCallbackChannel(callback);
    let currentValue = propertyRegistration((r) => (r(objectValue, propertyName)), (value) => {
        currentValue = value;
        if (channel.isOpen()) {
            channel.init()
        }
    });

    return channel
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useObjectListener = (objectValue, callback = () => { }, listenKeys) => {
    const eachCall = (keys, call) => {
        if (keys) {
            for (const propKey of keys) {
                call(propKey);
            }
        } else {
            for (const propKey in objectValue) {
                call(propKey);
            }
        }
    }
    const createCallbackChannel = (childCallback = () => { }) => {
        let isOpen = true;
        const listenerService = {
            addCallback: (newCallback) => {
                const parentCallback = childCallback;
                childCallback = (...args) => {
                    parentCallback(...args);
                    newCallback(...args);
                };
                return listenerService
            },
            addChildListener: (newCallback) => {
                const childChannel = createCallbackChannel(newCallback);
                const parentCallback = childCallback;
                childCallback = (objectValue, name, value) => {
                    parentCallback(objectValue, name, value);
                    if (childChannel.isOpen()) {
                        childChannel.initEach([name]);
                    }
                };
                return childChannel
            },
            close: () => {
                isOpen = false
                return listenerService
            },
            isOpen: () => {
                return isOpen
            },
            open: () => {
                isOpen = true
                return listenerService
            },
            initEach: (propertyNames = listenKeys) => {
                eachCall(propertyNames, (name) => {
                    if (name in objectValue) {
                        childCallback(objectValue, name, objectValue[name]);
                    }
                });

                return listenerService
            },
            getValue: () => objectValue
        }
        return listenerService;
    }

    const channel = createCallbackChannel(callback);
    eachCall(listenKeys, (propertyName) => propertyRegistration((r) => (r(objectValue, propertyName)), () => {
        if (channel.isOpen()) {
            channel.initEach([propertyName])
        }
    }));
    return channel
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////