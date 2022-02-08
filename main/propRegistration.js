import kix from "kix";



export default function replaceArrayNodes(nodes, values, returnNodes, valuesIndex = 0, nodeIndex = 0, value, node) {
    while ((valuesIndex in values) || (nodeIndex in nodes)) {
        value = values[valuesIndex];
        node = nodes[nodeIndex];
        if (value instanceof Array) {
            nodeIndex = replaceArrayNodes(nodes, (value.length ? value : [""]), returnNodes, 0, nodeIndex);
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

export function R(registerFunction) {
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
                            replaceArrayNodes(
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

        replaceArrayNodes(
            kix(parent, [""]),
            [value],
            (currentNodes = [])
        )
        return currentNodes;
    }
}