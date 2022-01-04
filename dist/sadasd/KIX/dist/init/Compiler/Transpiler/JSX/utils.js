"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitFunctionDeclarationForJsxRegistrator = exports.PropertyAccessExpressionOrElementAccessExpression = exports.ConvertJsxToObject = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("../createFactoryCode");
const { createStringLiteral, createIdentifier, createArrayLiteralExpression, createUniqueName } = typescript_1.factory;
const useJsxPropRegistrator = (visitor, CTX, NODE, getRegistratorBody) => {
    const OldRegistrator = CTX.getJSXPropertyRegistrator;
    let getRegistratorName;
    CTX.getJSXPropertyRegistrator = () => (getRegistratorName || (getRegistratorName = createUniqueName("__JSX_PROP_REGISTRATOR")));
    const newNode = visitor(NODE);
    CTX.getJSXPropertyRegistrator = OldRegistrator;
    if (getRegistratorName) {
        return getRegistratorBody(newNode, getRegistratorName);
    }
    return newNode;
};
const ConvertJsxToObject = (visitor, CTX, tagName, attributes, children) => {
    const newPropertys = [];
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
            newChildren.push(useJsxPropRegistrator(visitor, CTX, child, createFactoryCode_1.generateFactory.CREATE_Prop_Registrator_For_Child.bind(createFactoryCode_1.generateFactory)));
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
            newPropertys.push([attribute.name, useJsxPropRegistrator(visitor, CTX, initializer, createFactoryCode_1.generateFactory.CREATE_Prop_Registrator_For_Attribute.bind(createFactoryCode_1.generateFactory))]);
        }
    }
    if (EventExist) {
        const eKind = EventExist.kind;
        if (eKind === typescript_1.SyntaxKind.ObjectLiteralExpression) {
            Array.prototype.push.apply(EventsKeys, EventExist.properties);
        }
        else if (EventsKeys.length) {
            EventsKeys.push(createFactoryCode_1.generateFactory.CREATE_Spread_Assignment(EventExist));
        }
    }
    if (EventsKeys.length) {
        newPropertys.push([createIdentifier("e"), createFactoryCode_1.generateFactory.CREATE_Object_WiTH_String_Keys(EventsKeys)]);
    }
    return createFactoryCode_1.generateFactory.CREATE_Object_WiTH_String_Keys(newPropertys);
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
        return visitor(createFactoryCode_1.generateFactory.CREATE_CAll_Function(CTX.getJSXPropertyRegistrator(), getExpressionNames(NODE)));
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
