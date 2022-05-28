const routeParams = {};
const type = (arg) => Object.prototype.toString.call(arg);
const isHtml = (tag) => (tag?.__proto__.ELEMENT_NODE === Node.ELEMENT_NODE)
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const createSVGElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName)

// TODO:svg Ns ის დეფაულთი და ასევე გენერირებული
const abstractNodes = {
    svg(objectNodeProperty, objectNode, createElementName, createElement) {
        return (parent) => {
            if (createElementName === createSVGElement) {
                objectNode = { ...objectNode };
                const node = createSVGElement(objectNodeProperty);
                KixSVG(node, objectNode[objectNodeProperty]);
                delete objectNode[objectNodeProperty];
                return createElement(objectNode, node)
            } else {
                return KixSVG(parent, objectNode)
            }
        }

    },
    switch(objectNodeProperty, objectNode, createElementName, createElement) {
        let switchObjectNode = {
            ...objectNode
        };
        const namedNode = createElementName("a")
        kix(namedNode, switchObjectNode[objectNodeProperty])
        delete switchObjectNode[objectNodeProperty];
        abstractAttributes.e(namedNode, {
            click: function (e) {
                e.preventDefault();
                // TODO: ავტო სქროლის გათიშვა დაამატე. პს სჯობს ჯერ გაარკვიო სხვაგან როგორ ისქროლება
                window.scrollTo(0, 0);
                const state = {
                    routeTime: new Date().getTime()
                }

                window.history.pushState(state, document.title, this.getAttribute("href"));
                window.dispatchEvent(new CustomEvent('popstate'));
            },
        });
        return createElement(switchObjectNode, namedNode)

    },
    routing(_, routeObjectNode) {
        const children = routeObjectNode.routing;
        const emptyComponent = flatFunction(routeObjectNode.ifEmptyComponent) || "";
        const [startMarker, endMarker] = createMarker()
        const [startRenderMarker, endRenderMarker, Render] = createMarker()
        const rerender = () => {
            let nextNode = startMarker
            let renderComponent = emptyComponent;
            while (nextNode = nextNode.nextSibling) {
                if (nextNode === endMarker) break;
                if (
                    nextNode.nodeType === Node.TEXT_NODE &&
                    !nextNode.textContent.trim().length
                ) {
                    continue
                }
                renderComponent = ""
            }
            if (endRenderMarker.parentNode) {
                Render(renderComponent)
            };
            return renderComponent
        }
        window.addEventListener("popstate", rerender)

        return [startMarker, children, endMarker, startRenderMarker, rerender, endRenderMarker]
    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {
        let currentComponent;
        let currentNodesCache;
        const [startMarker, endMarker, Render, getChildren] = createMarker();
        const toPath = flatFunction(path);
        const uniqValue = flatFunction(unique);
        const componentValue = flatFunction(component);
        const escapeRegexp = [/[-[\]{}()*+!<=?.\/\\^$|#\s,]/g, "\\$&"];
        const regExpString = (uniqValue ? [
            escapeRegexp,
            [/\((.*?)\)/g, "(?:$1)?"],
            [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
            [/\*\w+/g, "(.*?)"]
        ] : [
            escapeRegexp,
            [/:[^\s/]+/g, "([\\w-]+)"]
        ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), toPath);
        const routeRegExp = new RegExp(uniqValue ? "^" + regExpString + "$" : regExpString, "i");
        const getRouteNode = () => {
            const localPath = decodeURI(document.location.pathname);
            const matchPath = localPath.match(routeRegExp) || [];

            toPath.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (routeParams[v] = matchPath[i]));

            let renderComponent;
            if (routeRegExp.test(localPath)) {
                renderComponent = componentValue
            }
            if (renderComponent === componentValue) {
                if (currentComponent === componentValue) {
                    currentNodesCache = getChildren();
                }
                if (currentNodesCache &&
                    currentComponent === componentValue
                ) return
            }
            if (endMarker.parentNode) {
                Render(renderComponent)
            };
            currentComponent = renderComponent;

            return renderComponent
        };

        window.addEventListener("popstate", getRouteNode);
        return [startMarker, getRouteNode, endMarker]
        // return [currentNodes, routeNode];
    },
    _R(objectNodeProperty, objectNode, createElementName, createElement) {


        return propertyRegistry(objectNode[objectNodeProperty]);
    },
    _F(objectNodeProperty, objectNode, createElementName, createElement) {
        const component = objectNode._F
        if (!(component instanceof Function)) return;

        if (component.prototype?.render) {
            class ComponentNode extends component {
                constructor() {
                    super();

                    const props = { ...(objectNode.s || {}), ...registerProps(this, objectNode.d) }

                    for (const propKey in props) {
                        this[propKey] = props[propKey];
                    }
                    this.children = objectNode.c || this.children
                    this.render = this.render || (() => { })
                }
            }

            return new ComponentNode().render();
        } else if (Object.getOwnPropertyDescriptor(component, 'prototype')?.writable !== false) {

            const props = registerProps({ ...(objectNode.s || {}) }, objectNode.d);
            const result = component(props);

            return result;
        }


    },
    _D(objectNodeProperty, objectNode, createElementName, createElement) {
        let node
        for (const attributeName in objectNode) {
            if (node) {
                node[attributeName] = (tagNode) => (propertyRegistry(objectNode[attributeName])(tagNode, attributeName));
            } else {
                node = { ...objectNode[attributeName] };
            }
        }

        return node

    }
}
//TODO: ტეგზე სპრეადის უსაფრთხო ასინგისთვის  სჯობს სბსტრაქტული ატრიბუტი შეიქმნას და ევენთის ფროფერთები გაიფილტროს 

const abstractAttributes = {
    e(node, eventsObject) {
        for (var eventNames in eventsObject) {
            for (var eventName of eventNames.split("_")) {
                if (eventsObject[eventName] instanceof Function) {
                    node.addEventListener(eventName, eventsObject[eventName]);
                }
            }
        }
    }
}

const setAttribute = (node, value, attributeName) => {
    const abstraction = abstractAttributes[attributeName]
    abstraction ? abstraction(node, value, attributeName) : node.setAttribute(attributeName, flatFunction(value, node, attributeName));
}

function createApp(createElementName) {


    function createElement(objectNode, elementNode) {

        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                setAttribute(elementNode, objectNode[objectNodeProperty], objectNodeProperty);
            } else {
                if (abstractNodes.hasOwnProperty(objectNodeProperty)) {
                    const newNode = abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement);
                    return isHtml(newNode) ? (newNode.parentNode ? null : newNode) : newNode;
                }
                kix((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
            }
        }
        return elementNode
    }


    return function kix(parent, children) {

        switch (type(children)) {
            case "[object Array]":
                return children.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, children(parent));
            case "[object Object]":
                return kix(parent, createElement(children))
            case "[object Promise]":
                children.then((result) => children.Replace(result));
                return children = kix(parent, "");
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                children = ""
            default:

                if (!isHtml(children)) {
                    children = document.createTextNode(children + "");
                }

        }


        if (isHtml(parent)) {
            parent.appendChild(children)
        }
        return children;
    }
}


const KixSVG = createApp(createSVGElement);
export const kix = createApp(document.createElement.bind(document));
export default kix;
export const styleCssDom = kix(document.body, { style: "" });
export class Component { render() { } }
export const Router = {
    params: routeParams,
    history: window.history
}
export const useListener = (objectValue, propertyName, callback) => {
    let closed = false;
    let callBackList = [];
    const listenerService = {
        addCallback(callback) {
            if (callback instanceof Function) {
                callBackList.push(callback)
            }
            return listenerService
        },
        removeCallback(callback) {
            callBackList = callBackList.filter(f => (f !== callback))
            return listenerService
        },
        close() {
            closed = true;
        },
        open() {
            closed = false;
        }
    }
    const registerFunction = (r) => (r(objectValue, propertyName));
    ((registration(registerFunction, (value) => {
        if (closed) return;
        for (const callback of callBackList) {
            callback(value, propertyName)
        }
    }))());

    return listenerService.addCallback(callback)
};
/////////////////////////////////////
function registration(registerFunction, onSet) {
    const getValue = () => (registerFunction(function () {
        return Array.prototype.reduce.call(arguments, (obj, key) => {
            let value = obj?.[key];

            if (typeof obj === "object") {
                const { set, configurable } = (Object.getOwnPropertyDescriptor(obj, key) || {});
                const defineRegistrations = set?._R_C || [];
                if (configurable !== false && defineRegistrations.indexOf(registerFunction) === -1) {
                    defineRegistrations.push(registerFunction);
                    function setter(setValue) {
                        value = setValue;
                        (set && set(value));
                        onSet(value);
                    }
                    setter._R_C = defineRegistrations
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            return value;
                        },
                        set: setter
                    })

                }
            }
            return typeof value === "function" ? value.bind(obj) : value;
        })
    }));

    return getValue
}
/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
დინამიური jsx კომპონენტების prop ები სარეგისტრაციო
*/
function registerProps(props, registerProps) {
    for (const attrKey in (registerProps || {})) {
        const getValue = registration(registerProps[attrKey], () => {
            // console.log("🚀 --> file: index.js --> line 324 --> getValue --> attrKey", attrKey);
            props[attrKey] = getValue();
        });
        props[attrKey] = getValue()
    }
    return props;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
ანაცვლებს მასივურ ელემენტებს ახლით
*/

function createMarker() {
    const startMarker = kix(null, "");
    const endMarker = kix(null, "");
    const replaceNodes = (sibling, replaceNode, currentNodes) => {

        if (replaceNode instanceof Array) {
            for (const childNode of replaceNode) {
                sibling = replaceNodes(sibling, childNode, currentNodes)
            }
        } else {
            const parent = sibling.parentNode;
            const replaceableNode = kix(null, flatFunction(replaceNode, parent));
            if (replaceableNode instanceof Array) {
                return replaceNodes(sibling, replaceableNode, currentNodes)
            } else if (sibling === endMarker) {
                parent.insertBefore(replaceableNode, endMarker);
            } else {
                parent.replaceChild(replaceableNode, sibling);
                sibling = replaceableNode.nextSibling;
            }
            currentNodes.push(replaceableNode);
        }
        return sibling;
    }

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
            return currentNodes
        },
        (currentNodes = [], sibling = startMarker) => {
            while ((sibling = sibling.nextSibling) && sibling !== endMarker) {
                currentNodes.push(sibling);
            }
            return currentNodes
        }
    ]
}
/////////////////////////////////////////////////////////////////////////////////////
/*
აკეთებს დინამიური ფროფერთების რეგისტრაციას
*/
function propertyRegistry(registerFunction) {
    let currentNodes;
    return (parent, attribute) => {
        const [startMarker, endMarker, Render] = createMarker();

        const getRenderValue = registration((a) => registerFunction(a), (value) => {
            if (attribute) {
                setAttribute(parent, getRenderValue(parent, attribute), attribute);
            } else {
                Render(getRenderValue(parent, attribute));
            }
        });

        const value = getRenderValue();

        if (attribute) {
            return value;
        }
        // აუცილებელია ესე დარენდეერდეს რადგან მშობლის ჩაწოდება პირველადი რენდერისას აუცილებლობასწარმოადგენს
        return [startMarker, value, endMarker];
    }
}
/////////////////////////////////////////////////////////////////////////////////////