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
        namedNode.e({
            click: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                const state = {
                    routeTime: new Date().getTime()
                }

                const routeEvent = new CustomEvent('popstate');
                history.pushState(state, document.title, this.getAttr("href"));
                window.dispatchEvent(routeEvent);
            },
        });
        return (parent) => createElement(switchObjectNode, namedNode)

    },
    routing(_, routeObjectNode) {

        const tagName = flatFunction(routeObjectNode.tagName) || "div",
        const ifEmptyComponent = flatFunction(routeObjectNode.ifEmptyComponent) || "",
        const children = routeObjectNode.routing;
        let currentNodes = kix(null, [''])
        const newRouteBoxNode = {
            [tagName]: [currentNodes, children],
            ...routeObjectNode,
        };

        delete newRouteBoxNode.tagName;
        delete newRouteBoxNode.ifEmptyComponent;
        delete newRouteBoxNode.routing;
        const routeDomNode = kix(null, newRouteBoxNode)

        function rerender() {
            const renderComponent = routeDomNode.firstElementChild || routeDomNode.innerHTML.trim().length ? "" : ifEmptyComponent;

            replaceArrayNodes(
                currentNodes,
                [renderComponent],
                (currentNodes = [])
            )
        }

        window.addEventListener("popstate", rerender);

        return [routeDomNode, rerender]
    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {

        let currentNodes = kix(null, [""]);
        const to = flatFunction(path),
            uniqValue = flatFunction(unique),
            componentValue = flatFunction(component),
            escapeRegexp = [/[-[\]{}()*+!<=?.\/\\^$|#\s,]/g, "\\$&"],
            toPath = (uniqValue ? [
                escapeRegexp,
                [/\((.*?)\)/g, "(?:$1)?"],
                [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
                [/\*\w+/g, "(.*?)"]
            ] : [
                escapeRegexp,
                [/:[^\s/]+/g, "([\\w-]+)"]
            ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to),
            routeRegExp = new RegExp(uniqValue ? "^" + toPath + "$" : toPath, "i"),
            routeNodes = {},
            createRouterNode = () => {
                const localPath = decodeURI(document.location.pathname);
                const matchPath = localPath.match(routeRegExp) || [];
                const preCurrentNodes = [];

                to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (routeParams[v] = matchPath[i]));

                let renderComponent = "";
                if (routeRegExp.test(localPath)) {
                    renderComponent = routeNodes[routeRegExp] || componentValue;
                    routeNodes[routeRegExp] = preCurrentNodes;
                }

                replaceArrayNodes(
                    currentNodes,
                    [renderComponent],
                    (currentNodes = preCurrentNodes)
                );
            };

        return [currentNodes, () => (createRouterNode(), window.addEventListener("popstate", createRouterNode))]
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

            return component(props);
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
    getAttr(a) {
        return this.getAttribute(a);
    },
    setAttr(attribute, value) {
        value = flatFunction(value, this, attribute)
        abstractAttributes[attribute] ? this[attribute](value, attribute) : this.setAttribute(attribute, value);
    },
    Append(childNode) {
        return kix(this, childNode);
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
        let parent = this.parentNode

        if (parent) {
            replaceNode = kix(null, flatFunction(replaceNode, parent));

            if (replaceNode instanceof Array) {

                replaceArrayNodes([this], replaceNode, []);
            } else {
                parent?.replaceChild(replaceNode, this);
            }
            return replaceNode;
        }
        return this;
    },
    Insert(method, node) {
        const parent = this.parentNode,
            HtmlNode = kix(null, flatFunction(node, parent));

        if (!parent) return;
        switch (method) {
            case "after":
                const netNode = this.nextSibling;
                if (netNode) {
                    parent.insertBefore(HtmlNode, netNode);
                    return HtmlNode;
                } else {
                    return parent.Append(HtmlNode);
                }
            case "before":
                parent.insertBefore(HtmlNode, this);
                return HtmlNode;
        }
    },

}
for (const key in abstractAttributes) { (Node.prototype[key] = abstractAttributes[key]) }

function createApp(createElementName) {


    function createElement(objectNode, elementNode) {

        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
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
export var routeParams = {};
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
            let value = obj?.[key]
            if (obj?.hasOwnProperty(key)) {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                const defineRegistrations = descriptor?.set?._R_C || [];
                if (defineRegistrations.indexOf(registerFunction) === -1) {
                    defineRegistrations.push(registerFunction);
                    function set(setValue) {
                        value = setValue;
                        descriptor.set && descriptor.set(value)
                        onSet(value);
                    }
                    set._R_C = defineRegistrations
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            return value;
                        },
                        set
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
            props[attrKey] = getValue()
        })
        props[attrKey] = getValue()
    }
    return props;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
ანაცვლებს მასივურ ელემენტებს ახლით
*/

function replaceArrayNodes(nodes, values, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {

    while ((valuesIndex in values) || (nodeIndex in nodes)) {
        value = values[valuesIndex];
        node = nodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceArrayNodes(nodes, (value.length ? value : [""]), returnNodes, 0, nodeIndex);
        } else if (node) {


            if (valuesIndex in values) {
                const replacedNodes = node.Replace(value)

                if (replacedNodes instanceof Array) {
                    returnNodes.push(...replacedNodes)
                } else {
                    returnNodes.push(replacedNodes)
                }
            } else {
                node.Remove();
            }
            nodeIndex++;
        } else {
            returnNodes.push(returnNodes[returnNodes.length - 1].Insert("after", value));
        }
        valuesIndex++;
    }
    return nodeIndex
}

/////////////////////////////////////////////////////////////////////////////////////
/*
აკეთებს დინამიური ფროფერთების რეგისტრაციას
*/
function propertyRegistry(registerFunction) {
    let currentNodes;
    return (parent, attribute) => {
        const getRenderValue = registration((a) => registerFunction(a), (value) => {
            if (attribute) {

                parent.setAttr(attribute, getRenderValue(parent, attribute));
            } else {
                replaceArrayNodes(
                    currentNodes,
                    [getRenderValue(parent, attribute)],
                    (currentNodes = [])
                );

            }
        });

        const value = getRenderValue();

        if (attribute) {
            return value;
        }

        replaceArrayNodes(
            kix(parent, [""]),
            [value],
            (currentNodes = [])
        )
        // return "";
    }
}
/////////////////////////////////////////////////////////////////////////////////////