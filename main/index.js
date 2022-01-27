// "use strict"


// // type typeAsType = <T = unknown>() => ;


// // "[object Array]"


// const type = (arg) => Object.prototype.toString.call(arg)

// const abstractNodes = {

// }
// const abstractAttributes = {
//     setAttr(attribute, value) {
//         this.setAttribute(attribute, value);
//     }
// }
// Object.assign(Node.prototype, AttributeMethods);

// function createApp(createElementName) {


//     function createElement(objectNode, elementNode) {
//         for (var objectNodeProperty in objectNode) {
//             if (elementNode) {
//                 elementNode.setAttr(objectNodeProperty, objectNode[objectNodeProperty]);
//             } else {
//                 if (abstractNodes[objectNodeProperty]) {
//                     return abstractNodes[objectNodeProperty](objectNodeProperty, objectNode, createElementName, createElement)
//                 }
//                 Kix((elementNode = createElementName(objectNodeProperty)), objectNode[objectNodeProperty]);
//             }
//         }
//     }



//     return function kix(parent, child) {
//         switch (type(child)) {
//             case "[object Array]":
//                 return child.map((childNode) => Kix(parent, childNode));
//             case "[object Function]":
//                 return Kix(parent, child());
//             case "[object Object]":
//                 node = createElement(child);
//                 break;
//             case "[object Promise]":
//                 node.then(function (result) {
//                     node.Replace(result);
//                 });
//             case "[object Undefined]":
//             case "[object Null]":
//             case "[object Boolean]":
//                 node = ""
//             case "[object Number]":
//             case "[object String]":
//             case "[object Date]":
//             case "[object RegExp]":
//             case "[object BigInt]":
//             case "[object Symbol]":
//             case "[object Error]":
//             case "[object Date]":
//                 const textNode = document.createTextNode(String(node));
//                 textNode._kixNode = node;
//                 node = textNode;
//         }


//         return parent && parent.appendChild(node), node;
//     }
// }


// const createSvgNode = createNodeApp(createSvgElement);
// export const kix = createNodeApp(document.createElementName.bind(document));
// export default kix;