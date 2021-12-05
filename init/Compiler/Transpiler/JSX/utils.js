import ts, {
    factory,
    visitEachChild,
    getDirectoryPath,
    isNamespaceExport,
    idText,
    createIdentifier,
    normalizeSlashes,
    SyntaxKind,
    getLocalNameForExternalImport,
    collectExternalModuleInfo,
    SignatureKind,
    createNull
} from "typescript"
import {
    generateFactory
} from "../createFactoryCode"
const {
    createStringLiteral,
    createIdentifier,
    createArrayLiteralExpression,
    createUniqueName
} = factory
// const {
// generateFactory.CREATE_Object_WiTH_String_Keys,
// generateFactory.CREATE_Spread_Assignment,
// generateFactory.CREATE_CAll_Function,
// generateFactory.CREATE_Prop_Registrator_For_Attribute,
// generateFactory.CREATE_Prop_Registrator_For_Child
// } = generateFactory



const useJsxPropRegistrator = (visitor, CTX, NODE, getRegistratorBody) => {
    // იქმნება jsx ში მოთავსებული პროპების რეგისტრატორი
    const OldRegistrator = CTX.getJSXPropertyRegistrator
    let getRegistratorName;
    CTX.getJSXPropertyRegistrator = () => (getRegistratorName || (getRegistratorName = createUniqueName("__JSX_PROP_REGISTRATOR")))
    /////////////////////////////////////////////////////
    const newNode = visitor(NODE)
    // jsx მოთავსებული პროპების რეგისტრატორი უბრუნდება საწყის მნიშვნელობას
    CTX.getJSXPropertyRegistrator = OldRegistrator
    /////////////////////////////////////////////////////////////////////////

    if (getRegistratorName) {
        return getRegistratorBody(newNode, getRegistratorName)
    }
    return newNode
}

export const ConvertJsxToObject = (visitor, CTX, tagName, attributes, children) => {
    const newPropertys = []



    // გენერირდება ტეგის სახელი და მისი შვილები
    const newChildren = children.reduce((newChildren, child, index) => {
        child = getInitializer(child)
        if (!child) {
            return newChildren
        }
        if (SyntaxKind.JsxText === child.kind) {
            if (!((index === 0 || index === (children.length - 1)) && child.text.trim().length === 0)) {
                newChildren.push(visitor(createStringLiteral(child.text)))
            }
        } else {
            newChildren.push(useJsxPropRegistrator(visitor, CTX, child, generateFactory.CREATE_Prop_Registrator_For_Child.bind(generateFactory)))
        }
        return newChildren
    }, [])

    if (newChildren.length) {
        if (newChildren.length === 1) {
            newPropertys.push([tagName, newChildren[0]])
        } else {
            newPropertys.push([tagName, createArrayLiteralExpression(
                newChildren,
                false
            )])
        }
    } else {
        newPropertys.push([tagName, createNull()])
    }
    ////////////////////////////////////////////

    // გენერირდება ატრიბუები
    const EventsKeys = []
    let EventExist;
    for (const attribute of attributes.properties) {
        const attrName = idText(attribute.name)
        let initializer = getInitializer(attribute.initializer)

        if (!initializer) {
            continue;
        }

        if (/^(on+[A-Z])/.test(attrName)) {
            EventsKeys.push([attribute.name, visitor(initializer)])
        } else if (attrName === "e") {
            EventExist = initializer
        } else {
            newPropertys.push([attribute.name, useJsxPropRegistrator(visitor, CTX, initializer, generateFactory.CREATE_Prop_Registrator_For_Attribute.bind(generateFactory))])
        }
    }
    /////////////////////////



    // გენერირდება ევენთები
    if (EventExist) {
        const eKind = EventExist.kind
        if (eKind === SyntaxKind.ObjectLiteralExpression) {
            Array.prototype.push.apply(EventsKeys, EventExist.properties)
        } else if (EventsKeys.length) {
            EventsKeys.push(generateFactory.CREATE_Spread_Assignment(EventExist))
        }
    }
    if (EventsKeys.length) {

        newPropertys.push([createIdentifier("e"), generateFactory.CREATE_Object_WiTH_String_Keys(EventsKeys)])
    }
    ///////////////////////

    return generateFactory.CREATE_Object_WiTH_String_Keys(newPropertys)
}



const getInitializer = (initializer) => {
    if (initializer.kind === SyntaxKind.JsxExpression) {
        if (!initializer.expression) {
            return
        }
        return initializer.expression
    }
    return initializer
}







const getExpressionNames = ({ expression, argumentExpression, name }, expressionIdentifers = []) => {


    if (ts.isPropertyAccessExpression(expression)) {
        getExpressionNames(expression, expressionIdentifers)
    } else if (ts.isElementAccessExpression(expression)) {
        getExpressionNames(expression.expression, expressionIdentifers)
    } else {
        expressionIdentifers.push(expression)
    }


    expressionIdentifers.push(argumentExpression || createStringLiteral(idText(name)))

    return expressionIdentifers
}

export const PropertyAccessExpressionOrElementAccessExpression = (NODE, visitor, CTX) => {
    if (CTX.getJSXPropertyRegistrator) {
        return visitor(generateFactory.CREATE_CAll_Function(CTX.getJSXPropertyRegistrator(), getExpressionNames(NODE)))
    }

    return visitEachChild(NODE, visitor, CTX)
}


export const visitFunctionDeclarationForJsxRegistrator = (NODE, visitor, CTX) => {
    const OldRegistrator = CTX.getJSXPropertyRegistrator
    CTX.getJSXPropertyRegistrator = undefined
    const newNode = visitEachChild(NODE, visitor, CTX)
    CTX.getJSXPropertyRegistrator = OldRegistrator
    return newNode
}