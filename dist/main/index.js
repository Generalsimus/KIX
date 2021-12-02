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
exports.NodeMethods = {
    svg(objectNode) {
        return createSvgNode(null, objectNode);
    },
    switch(switchObjectNode, nodeName, createElement, createKixElement) {
        let newSwitchObjectNode = { ...switchObjectNode };
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
        value instanceof Function
            ? this.setAttr(attribute, value(this, attribute))
            :
                exports.AttributeMethods[attribute]
                    ?
                        this[attribute](value, attribute, this)
                    :
                        this.setAttribute(attribute, value);
        return this;
    },
    Select(query) {
        return query instanceof Array
            ?
                this.querySelectorAll(query.join(", "))
            :
                this.querySelector(query);
    },
    Child(index) {
        const c = this.children;
        return index == undefined ? c : c[index];
    },
    Inner(innerHTML) {
        return innerHTML
            ?
                (this.innerHTML = "" && kix(this, innerHTML))
            :
                this.innerHTML;
    },
    setStyle(styleAttr) {
        styleAttr instanceof Object
            ?
                Object.assign(this.style, styleAttr)
            :
                styleAttr && this.setAttribute("style", String(styleAttr));
        return this.style;
    },
    e(eventsObject) {
        for (var eventNames in eventsObject) {
            for (var eventName in eventNames.split("_")) {
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
        replaceNode = kix(null, kix(replaceNode, this.parentNode));
        this.parentNode.replaceChild(replaceNode, this);
        return replaceNode;
    },
    insert(method, node) {
        switch (method) {
            case "after":
                let n = this.nextSibling, p = this.Parent();
                if (n) {
                    method = kix(null, node);
                    p.insertBefore(method, n);
                    return method;
                }
                else {
                    return p.Append(node);
                }
            case "before":
                p = this.Parent();
                method = kix(null, node);
                p.insertBefore(method, this);
                return method;
        }
    },
    Restart() {
        let node = kix(null, this.KNode);
        this.Replace(node);
        return node;
    },
};
Object.assign(Node.prototype, exports.AttributeMethods);
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
                const textNode = document.createTextNode((node = String(node)));
                textNode.KNode = node;
                node = textNode;
                break;
        }
        return parent && parent.appendChild(node), node;
    }
    return Kix;
}
exports.createNodeApp = createNodeApp;
const createSvgNode = createNodeApp((nodeName) => document.createElementNS("http://www.w3.org/2000/svg", nodeName));
const kix = createNodeApp(document.createElement.bind(document));
exports.style = kix(document.head, {
    style: "",
});
exports.default = kix;
