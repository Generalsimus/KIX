import replaceArrayNodes from "./propRegistration";

const type = (arg) => Object.prototype.toString.call(arg)
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc;
const routeParams = {};
const createSVGElement = (nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName)

const abstractNodes = {
    svg(objectNodeProperty, objectNode, createElementName, createElement) {
        return (parent) => {
            if (createElementName === createSVGElement) {
                objectNode = { ...objectNode };
                const node = createSVGElement(objectNodeProperty);
                KixSVG(node, objectNode[objectNodeProperty]);
                delete objectNode[objectNodeProperty];
                return createElement(objectNode, parent, node)
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
                    _routeID: new Date().getTime()
                }
                const routeEvent = new CustomEvent('popstate', { detail: state });
                history.pushState(state, document.title, this.getAttr("href"));
                window.dispatchEvent(routeEvent);
            },
        });
        return (parent) => createElement(switchObjectNode, parent, namedNode)

    },
    router(objectNodeProperty, { path, unique, component }, createElementName, createElement) {
        /////////////////////////////////////////////////////////////////
        return (parent) => {
            const to = flatFunction(path),
                uniqValue = flatFunction(unique),
                componentValue = flatFunction(component),
                escapeRegexp = [/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&"],
                toPath = (uniqValue ? [
                    escapeRegexp,
                    [/:[^\s/]+/g, "([\\w-]+)"]
                ] : [
                    escapeRegexp,
                    [/\((.*?)\)/g, "(?:$1)?"],
                    [/(\(\?)?:\w+/g, (match, optional) => optional ? match : "([^/]+)"],
                    [/\*\w+/g, "(.*?)"]
                ]).reduce((repl, reg) => repl.replace(reg[0], reg[1]), to),
                routeRegExp = new RegExp(uniqValue ? toPath : "^" + toPath + "$", "i"),
                routeNodes = {},
                createRouterNode = (_routeID) => {
                    var localPath = decodeURI(document.location.pathname),
                        matchPath = localPath.match(routeRegExp) || [];

                    to.replace(/\/:/g, "/").match(routeRegExp).forEach((v, i) => (routeParams[v] = matchPath[i]))

                    return routeRegExp.test(localPath) ? routeNodes[_routeID] || (routeNodes[_routeID] = componentValue) : "";
                };
            let existNode = kix(parent, createRouterNode())

            window.addEventListener("popstate", (routeEvent) => {

                const newNode = createRouterNode(routeEvent.detail?._routeID)
                if (existNode !== newNode) {

                    existNode = existNode.Replace(newNode);
                }
            })
            return existNode
        }

    }
}
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
        const parent = this.parentNode
        if (parent) {
            replaceNode = kix(null, flatFunction(replaceNode, parent));
            if (replaceNode instanceof Array) {
                replaceArrayNodes([this], replaceNode);
            } else {
                parent.replaceChild(replaceNode, this);
            }
            return replaceNode;
        }
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
                    return parent.Append(node);
                }
            case "before":
                parent.insertBefore(HtmlNode, this);
                return HtmlNode;
        }
    },
    // Parent() {
    //     return this.parentNode;
    // },
}
for (const key in abstractAttributes) { (Node.prototype[key] = abstractAttributes[key]) }

function createApp(createElementName) {


    function createElement(objectNode, parent, elementNode) {
        for (const objectNodeProperty in objectNode) {
            if (elementNode) {
                elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
            } else {
                if (abstractNodes.hasOwnProperty(objectNodeProperty)) {
                    return kix(parent, abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement))

                }
                kix((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
                elementNode._kixNode = objectNode;
            }
        }
        return elementNode
    }


    return function kix(parent, child) {
        switch (type(child)) {
            case "[object Array]":
                return child.map((childNode) => kix(parent, childNode));
            case "[object Function]":
                return kix(parent, child(parent));
            case "[object Object]":
                child = createElement(child, parent);
                break;
            case "[object Promise]":
                child.then(function (result) {
                    child.Replace(result);
                });
            case "[object Undefined]":
            case "[object Null]":
            case "[object Boolean]":
                child = ""
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
                break;
            default:
                if (!child instanceof Node) {
                    return kix(parent, String(child));
                }

        }

        return parent && parent.appendChild(child), child;
    }
    // return kix;
}


const KixSVG = createApp(createSVGElement);
export const kix = createApp(document.createElement.bind(document));
export default kix; 