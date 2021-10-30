"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitFunctionDeclarationForJsxRegistrator = exports.PropertyAccessExpressionOrElementAccessExpression = exports.ConvertJsxToObject = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("../createFactoryCode");
const { createStringLiteral, createIdentifier, createArrayLiteralExpression, createUniqueName } = typescript_1.factory;
const { CREATE_Object_WiTH_String_Keys, CREATE_Spread_Assignment, CREATE_CAll_Function, CREATE_Prop_Registrator_For_Attribute, CREATE_Prop_Registrator_For_Child } = createFactoryCode_1.generateFactory;
const useJsxPropRegistrator = (visitor, CTX, NODE, getRegistratorBody) => {
    // იქმნება jsx ში მოთავსებული პროპების რეგისტრატორი
    const OldRegistrator = CTX.getJSXPropertyRegistrator;
    let getRegistratorName;
    CTX.getJSXPropertyRegistrator = () => (getRegistratorName || (getRegistratorName = createUniqueName("__JSX_PROP_REGISTRATOR")));
    /////////////////////////////////////////////////////
    const newNode = visitor(NODE);
    // jsx მოთავსებული პროპების რეგისტრატორი უბრუნდება საწყის მნიშვნელობას
    CTX.getJSXPropertyRegistrator = OldRegistrator;
    /////////////////////////////////////////////////////////////////////////
    if (getRegistratorName) {
        return getRegistratorBody(newNode, getRegistratorName);
    }
    return newNode;
};
const ConvertJsxToObject = (visitor, CTX, tagName, attributes, children) => {
    const newPropertys = [];
    // გენერირდება ტეგის სახელი და მისი შვილები
    const newChildren = children.reduce((newChildren, child, index) => {
        child = getInitializer(child);
        if (!child) {
            return newChildren;
        }
        if (typescript_1.SyntaxKind.JsxText === child.kind) {
            if (!((index === 0 || index === (children.length - 1)) && child.text.trim().length === 0)) {
                newChildren.push(visitor(createStringLiteral(child.text)));
            }
        }
        else {
            newChildren.push(useJsxPropRegistrator(visitor, CTX, child, CREATE_Prop_Registrator_For_Child));
        }
        return newChildren;
    }, []);
    if (newChildren.length) {
        if (newChildren.length === 1) {
            newPropertys.push([tagName, newChildren[0]]);
        }
        else {
            newPropertys.push([tagName, createArrayLiteralExpression(newChildren, false)]);
        }
    }
    else {
        newPropertys.push([tagName, (0, typescript_1.createNull)()]);
    }
    ////////////////////////////////////////////
    // გენერირდება ატრიბუები
    const EventsKeys = [];
    let EventExist;
    for (const attribute of attributes.properties) {
        const attrName = (0, typescript_1.idText)(attribute.name);
        let initializer = getInitializer(attribute.initializer);
        if (!initializer) {
            continue;
        }
        if (/^(on+[A-Z])/.test(attrName)) {
            EventsKeys.push([attribute.name, visitor(initializer)]);
        }
        else if (attrName === "e") {
            EventExist = initializer;
        }
        else {
            newPropertys.push([attribute.name, useJsxPropRegistrator(visitor, CTX, initializer, CREATE_Prop_Registrator_For_Attribute)]);
        }
    }
    /////////////////////////
    // გენერირდება ევენთები
    if (EventExist) {
        const eKind = EventExist.kind;
        if (eKind === typescript_1.SyntaxKind.ObjectLiteralExpression) {
            Array.prototype.push.apply(EventsKeys, EventExist.properties);
        }
        else if (EventsKeys.length) {
            EventsKeys.push(CREATE_Spread_Assignment(EventExist));
        }
    }
    if (EventsKeys.length) {
        newPropertys.push([createIdentifier("e"), CREATE_Object_WiTH_String_Keys(EventsKeys)]);
    }
    ///////////////////////
    return CREATE_Object_WiTH_String_Keys(newPropertys);
};
exports.ConvertJsxToObject = ConvertJsxToObject;
const getInitializer = (initializer) => {
    if (initializer.kind === typescript_1.SyntaxKind.JsxExpression) {
        if (!initializer.expression) {
            return;
        }
        return initializer.expression;
    }
    return initializer;
};
const getExpressionNames = ({ expression, argumentExpression, name }, expressionIdentifers = []) => {
    if (typescript_1.default.isPropertyAccessExpression(expression)) {
        getExpressionNames(expression, expressionIdentifers);
    }
    else if (typescript_1.default.isElementAccessExpression(expression)) {
        getExpressionNames(expression.expression, expressionIdentifers);
    }
    else {
        expressionIdentifers.push(expression);
    }
    expressionIdentifers.push(argumentExpression || createStringLiteral((0, typescript_1.idText)(name)));
    return expressionIdentifers;
};
const PropertyAccessExpressionOrElementAccessExpression = (NODE, visitor, CTX) => {
    if (CTX.getJSXPropertyRegistrator) {
        return visitor(CREATE_CAll_Function(CTX.getJSXPropertyRegistrator(), getExpressionNames(NODE)));
    }
    return (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
};
exports.PropertyAccessExpressionOrElementAccessExpression = PropertyAccessExpressionOrElementAccessExpression;
const visitFunctionDeclarationForJsxRegistrator = (NODE, visitor, CTX) => {
    const OldRegistrator = CTX.getJSXPropertyRegistrator;
    CTX.getJSXPropertyRegistrator = undefined;
    const newNode = (0, typescript_1.visitEachChild)(NODE, visitor, CTX);
    CTX.getJSXPropertyRegistrator = OldRegistrator;
    return newNode;
};
exports.visitFunctionDeclarationForJsxRegistrator = visitFunctionDeclarationForJsxRegistrator;
//# sourceMappingURL=utils.js.map