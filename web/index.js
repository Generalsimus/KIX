
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => (tag?.__proto__.ELEMENT_NODE === Node.ELEMENT_NODE);
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;



const GlobalRouteParams = {}
const RoutePathParams = {}
const KIX_UNIQUE_APP_USABLE_KEY = `$_%^${Math.random()}}^%_$`
const NODE_MOUNT_STATE_KEY = KIX_UNIQUE_APP_USABLE_KEY + "@#$%"
const NODE_MOUNT_AWAITER_KEY = NODE_MOUNT_STATE_KEY + "$%^&*"
const SETTER_ID_KEY = "_$IDS"
const WindowObject = window;
const DocumentObject = WindowObject.document;
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
        const [
            renderNodes,
            replaceChildren,
        ] = newCreateMarker()
        const storage = new Map();

        return [
            renderNodes,
            () => replaceChildren(
                storage,
                propertyRegistration(
                    objectNode[objectPropertyName],
                    (renderElement) => replaceChildren(storage, renderElement)
                )
            )
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
        const [renderChildComponentNodes, replaceChildren, getChildren] = newCreateMarker();
        const [renderEmptyNodes, replaceEmptyChildren,] = newCreateMarker();

        const renderComponent = () => {
            const { ifEmptyComponent } = objectNode
            const children = getChildren();

            for (const htmlNode of children) {
                const isTextNode = htmlNode.nodeType === Node.TEXT_NODE;
                if (!isTextNode || (isTextNode && htmlNode.textContent.trim().length)) {
                    return ""
                }
            }


            return ifEmptyComponent
        }
        const storage = new Map();
        const emptyComponentStorage = new Map();
        const resetComponent = () => {
            replaceEmptyChildren(storage, renderComponent());
        }
        useObjectListener(objectNode, resetComponent)

        WindowObject.addEventListener(KIX_UNIQUE_APP_USABLE_KEY, resetComponent);
        return [
            renderChildComponentNodes,
            renderEmptyNodes,
            () => {
                replaceChildren(storage, objectNode[objectPropertyName])
                replaceEmptyChildren(emptyComponentStorage, renderComponent())
            }
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


            return queryRegExp.test(localPath) ? component : ""
        }
        const [renderNodes, replaceChildren] = newCreateMarker();
        const storage = new Map();
        const resetComponent = () => {
            replaceChildren(storage, renderComponent());
            WindowObject.dispatchEvent(new CustomEvent(KIX_UNIQUE_APP_USABLE_KEY));
        }
        useObjectListener(objectNode, resetComponent)
        WindowObject.addEventListener("popstate", resetComponent);

        return [renderNodes, resetComponent];
    },
}

const abstractAttributes = {
    [KIX_UNIQUE_APP_USABLE_KEY](node, attributeName, value, setAttribute) {
        value(node);
    }
}

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

    function createObjectElement(objectNode, elementNode) {

        for (const objectPropertyName in objectNode) {
            if (elementNode) {
                setAttributeTagNode(elementNode, objectPropertyName, objectNode[objectPropertyName]);
            } else {
                if (abstractNodes.hasOwnProperty(objectPropertyName)) {
                    return abstractNodes[objectPropertyName](objectNode, objectPropertyName, kix, createElementName, setAttributeTagNode, createObjectElement);
                }

                kix((elementNode = createElementName(objectPropertyName)), objectNode[objectPropertyName]);
            }
        }
        return elementNode
    }

    const kix = (parent, children) => {

        switch (type(children)) {
            case "[object Array]":
                return children.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, children(parent));
            case "[object Object]":
                return kix(parent, createObjectElement(children))
            case "[object Promise]":
                const [renderNodes, replaceChildren] = newCreateMarker();
                children.then((result) => replaceChildren(result));
                return kix(parent, renderNodes);
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                children = ""
            default:
                if (!isHtml(children)) {
                    children = DocumentObject.createTextNode(children + "");
                }

        }


        if (isHtml(parent)) {
            parent.appendChild(children)
        }
        return children;
    }
    return kix
}


const cleanDescriptor = (startPoint, funcArgs, index, registrationId) => {
    for (let inc = index + 1; inc < funcArgs.length; ++inc) {
        const keyValue = funcArgs[inc];
        if (typeof startPoint === "object") {
            let { set } = Object.getOwnPropertyDescriptor(startPoint, keyValue) || {}
            const idList = set?.[SETTER_ID_KEY] || [];
            const keyIndex = idList.indexOf(registrationId);
            if (keyIndex !== -1) {
                idList.splice(keyIndex, 1);
            }
            startPoint = startPoint?.[startPoint]
        }
    }
}
let incrementId = 0;
const propertyRegistration = (registrationFunc, callback = () => { }) => {
    const registrationId = incrementId++;
    const getValue = () => registrationFunc(function () {
        const ARGUMENTS = arguments
        return Array.prototype.reduce.call(ARGUMENTS, (prevValue, propertyKey, index) => {
            let value = prevValue?.[propertyKey];

            if (typeof prevValue === "object") {
                let { set, get, configurable } = Object.getOwnPropertyDescriptor(prevValue, propertyKey) || {};
                let isEnded = false
                const idList = set?.[SETTER_ID_KEY] || [];
                if (!idList.includes(registrationId) && configurable !== false) {
                    const setter = (newValue) => {
                        const oldGetterValue = prevValue?.[propertyKey]
                        value = newValue;
                        if (set) {
                            set(newValue);
                        }
                        const newGetterValue = prevValue?.[propertyKey];
                        if (typeof oldGetterValue === "object" && oldGetterValue !== newGetterValue) {
                            cleanDescriptor(oldGetterValue, ARGUMENTS, index, registrationId)
                        }
                        isEnded = isEnded || !idList.includes(registrationId)
                        if (!isEnded) {
                            callback(getValue());
                        }
                    }
                    setter[SETTER_ID_KEY] = idList
                    idList.push(registrationId);
                    Object.defineProperty(prevValue, propertyKey, {
                        enumerable: true,
                        configurable: true,
                        get: get || (() => value),
                        set: setter
                    });
                }
            }

            return typeof value === "function" ? value.bind(prevValue) : value
        })
    });
    return getValue()
}
const loopEachElements = (element, callback) => {
    if (element instanceof Array) {
        for (const item of element) {
            loopEachElements(item, callback);
        }
    } else {
        callback(element);
    }
}


const newCreateMarker = () => {
    const [startMarker, endMarker] = kix(null, ["", ""]);
    let ID = 0
    const replaceNode = (sibling, replaceElement, storage) => {
        if (replaceElement instanceof Array) {
            for (const item of replaceElement) {
                sibling = replaceNode(sibling, item, storage);
            }
        } else {
            const parent = sibling.parentNode;
            let cacheNodes = storage.get(replaceElement);
            let storageNode;
            if (cacheNodes) {
                for (const item of cacheNodes) {
                    if (item.id !== ID) {
                        if (item.isMount) {
                            loopEachElements(item.node, (node) => {
                                if (sibling === node) {
                                    sibling = node.nextSibling;
                                }
                                parent.removeChild(node);
                            });
                        }
                        storageNode = item;
                        break
                    }

                }
            } else {
                storage.set(replaceElement, cacheNodes = [])
            }
            if (!storageNode) {
                cacheNodes.push(storageNode = {
                    isMount: false,
                    id: ID,
                    node: kix(null, flatFunction(replaceElement, parent))
                });
            }
            storageNode.isMount = true;
            storageNode.id = ID;
            loopEachElements(storageNode.node, (node) => {

                node[NODE_MOUNT_STATE_KEY] = storageNode;
                if (sibling === endMarker) {
                    parent.insertBefore(node, endMarker);
                } else {
                    const mountState = sibling[NODE_MOUNT_STATE_KEY];
                    if (mountState) {
                        mountState.isMount = false;
                    }
                    parent.replaceChild(node, sibling);
                    sibling = node.nextSibling;
                }
                node[NODE_MOUNT_AWAITER_KEY]?.()
            });

        }
        return sibling
    }
    const replaceChildren = (storage, replaceElements) => {
        const startSibling = startMarker.nextSibling;
        if (startSibling) {
            ID++;
            let sibling = replaceNode(startSibling, replaceElements, storage);
            const parent = sibling.parentNode;

            while (sibling && sibling !== endMarker) {
                const nextSibling = sibling.nextSibling;
                const mountState = sibling[NODE_MOUNT_STATE_KEY];
                if (mountState) {
                    mountState.isMount = false;
                }
                parent.removeChild(sibling);
                sibling = nextSibling;
            }
        } else {
            startMarker[NODE_MOUNT_AWAITER_KEY] = endMarker[NODE_MOUNT_AWAITER_KEY] = () => {
                if (startMarker.parentNode && endMarker.parentNode) {
                    startMarker[NODE_MOUNT_AWAITER_KEY] = endMarker[NODE_MOUNT_AWAITER_KEY] = undefined
                    replaceChildren(storage, replaceElements);
                }
            }
        }

    }


    return [
        [startMarker, endMarker],
        replaceChildren,
        (currentNodes = [], sibling = startMarker) => {
            while ((sibling = sibling.nextSibling) && sibling !== endMarker) {
                currentNodes.push(sibling);
            }
            return currentNodes
        }
    ]
}

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
export const createElement = (tagName, renderCallback) => {
    abstractNodes[tagName] = (objectNode, tagName, kix, createElement, setAttribute, createObjectElement) => {
        objectNode[KIX_UNIQUE_APP_USABLE_KEY]?.();
        return renderCallback(objectNode, tagName, kix, createElement, setAttribute, createObjectElement)
    };
}
export const createAttribute = (attributeName, renderCallback, autoSet) => {
    abstractAttributes[attributeName] = (node, attributeName, value, setAttribute) => {
        const setValue = renderCallback(node, attributeName, value, setAttribute)
        if (autoSet) {
            setAttribute(node, attributeName, setValue);
        }
    }
}



/////////////////////////////////////////////////////////////////////////////////////
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