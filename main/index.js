"use strict"
const type = (arg) => Object.prototype.toString.call(arg)
const flatFunction = (ifFunc, ...args) => typeof ifFunc === "function" ? flatFunction(ifFunc(...args)) : ifFunc
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

    }
}
const abstractAttributes = {
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
        const parentNode = this.Parent();

        parentNode && parentNode.removeChild(this);

        return this;
    },
    Replace(replaceNode) {
        const parent = this.Parent()
        if (parent) {
            replaceNode = kix(null, flatFunction(replaceNode, this.Parent()));
            parent.replaceChild(replaceNode, this);
            return replaceNode;
        }
    },
    Insert(method, node) {
        const parent = this.Parent(),
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
    Parent(parentIndex) {

        return this.parentNode;
    },
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


function replaceChildNodes(nodes, values, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {
    while ((valuesIndex in values) || (nodeIndex in nodes)) {
        value = values[valuesIndex];
        node = nodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceChildNodes(nodes, (value.length ? value : [""]), returnNodes, 0, nodeIndex);
        } else if (node) {
            if (valuesIndex in values) {
                returnNodes.push(node.Replace(value));
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

export function __R(registerFunction) {
    let currentNodes;
    const getRenderValue = (parent, attribute) => {

        return registerFunction(function () {

            const objValue = Array.prototype.reduce.call(arguments, (obj, key) => {
                let descriptor = Object.getOwnPropertyDescriptor(obj, key),
                    value = obj[key],
                    defineRegistrations = descriptor?.set?._R_C || [];
                if (defineRegistrations.indexOf(registerFunction) === -1) {
                    defineRegistrations.push(registerFunction);
                    function set(setValue) {
                        value = setValue;
                        descriptor.set && descriptor.set(value)
                        if (attribute) {
                            parent.setAttr(attribute, value);
                        } else {
                            replaceChildNodes(
                                currentNodes,
                                [getRenderValue(parent, attribute)],
                                (currentNodes = [])
                            );
                        }
                    }
                    set._R_C = defineRegistrations
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        registrations: defineRegistrations,
                        get() {
                            return value;
                        },
                        set
                    })
                }

                return typeof value === "function" ? value.bind(obj) : value
            })
            return objValue
        })
    }

    return (parent, attribute) => {
        const value = getRenderValue(parent, attribute)
        if (attribute) {
            return value
        }

        replaceChildNodes(
            kix(parent, [""]),
            [value],
            (currentNodes = [])
        )
        return currentNodes;
    }
}