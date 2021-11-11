import ts, {
    SyntaxKind
} from "typescript"
import {
    generateFactory
} from "./createFactoryCode"
import {
    getColumnName
} from "../../../Helpers/utils"
import {
    geModuleLocationMeta
} from "./utils"

const factory = ts.factory
const {
    ExportKeyword
} = SyntaxKind
const {
    createUniqueName,
    createObjectLiteralExpression,
    createCallExpression,
    createIdentifier
} = factory


export function topLevelVisitor(node, currentSourceFile, CTX) {
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 9 --> topLevelVisitor --> node.kind", node.kind, SyntaxKind[node.kind]);
    switch (node.kind) {
        case SyntaxKind.ImportDeclaration:
            return visitImportDeclaration(node, currentSourceFile, CTX);
        // case 263:
        //     return visitImportEqualsDeclaration(node);
        case SyntaxKind.ExportDeclaration:
            return visitExportDeclaration(node, CTX)
        case SyntaxKind.ExportAssignment:
            return visitExportAssignment(node)
        case SyntaxKind.FirstStatement:
            return visitVariableStatement(node);
        case SyntaxKind.FunctionDeclaration:
            return visitFunctionDeclaration(node)
        case SyntaxKind.ClassDeclaration:
            return visitClassDeclaration(node)
        // case 347:
        //     return visitMergeDeclarationMarker(node);
        // case 348:
        //     return visitEndOfDeclarationMarker(node);
        default:
            return [node];
    }
}

function visitImportDeclaration(node, currentSourceFile, CTX) {

    const importClause = node.importClause


    if (!node.moduleSpecifier && !importClause) {
        return [node];
    }


    const compilerOptions = CTX.getCompilerOptions()


    var importAliasName = ts.getLocalNameForExternalImport(factory, node, currentSourceFile);

    const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)

    const moduleLocationNODE = ModuleData ?generateFactory.CREATE_Element_Access_Expression(ModuleData) : createIdentifier("undefined")
    if (node.moduleSpecifier && !importClause) {
        return [factory.createExpressionStatement(moduleLocationNODE)];
    }

    return generateFactory.CREATE_Const_Variable([
        [
            importAliasName,
            moduleLocationNODE
        ]
    ])

}

function visitExportDeclaration(node, CTX, newNodes = []) {
    const compilerOptions = CTX.getCompilerOptions()



    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++) {
            var specifier = _a[_i];

            newNodes.push(factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
                generateFactory.CREATE_Property_Access_Expression(["exports", specifier.name]),
                specifier.propertyName || specifier.name
            ])))

        }
    } else if (node.exportClause) {

        const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)
        // if (typeof Module_INDEX !== "number") {
        //     return newNodes
        // }
        newNodes.push(factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
            generateFactory.CREATE_Property_Access_Expression(["exports", node.exportClause.name]),
            (
                (ModuleData) ?
                    generateFactory.CREATE_Element_Access_Expression(ModuleData) :
                    createIdentifier("undefined")
            )
        ])))

        // export * as ns from "mod";
        // export * as default from "mod";
    } else {
        // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX
        const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)
        CTX.assignPolyfill = createUniqueName(compilerOptions.__Import_Module_Name + "_Assign")
        newNodes.push(createCallExpression(
            (CTX.assignPolyfill),
            undefined,
            [
                createIdentifier("exports"),
                (
                    (ModuleData) ?
                        generateFactory.CREATE_Element_Access_Expression(ModuleData) :
                        createObjectLiteralExpression([], false)
                )
            ]
        ))

        // export * from "mod";
    }
    return newNodes
}


function visitExportAssignment(node) {
    return [factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
        generateFactory.CREATE_Property_Access_Expression(["exports", "default"]),
        node.expression
    ]))]
}

function appendExportsOfBindingElement(decl, nodes) {
    if (ts.isBindingPattern(decl.name)) {
        for (var _i = 0, _a = decl.name.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (!ts.isOmittedExpression(element)) {
                appendExportsOfBindingElement(element, nodes);
            }
        }
    } else if (!ts.isGeneratedIdentifier(decl.name)) {

        nodes.push(factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
            generateFactory.CREATE_Property_Access_Expression(["exports", decl.name]),
            ts.createIdentifier(ts.idText(decl.name))
        ])))
    }
}

function checkModiferAndHaveExport(node, newNodes = [node]) {
    if (
        node.modifiers &&
        node.modifiers.some(({
            kind
        }) => ts.SyntaxKind.ExportKeyword === kind)
    ) {
        appendExportsOfBindingElement(node, newNodes)
    }
    return newNodes
}

function visitClassDeclaration(node) {

    return checkModiferAndHaveExport(node)
}

function visitFunctionDeclaration(node) {

    return checkModiferAndHaveExport(node)
}




function visitVariableStatement(node, newNodes = [node]) {
    if (
        node.modifiers &&
        node.modifiers.some(({
            kind
        }) => ts.SyntaxKind.ExportKeyword === kind)
    ) {
        for (var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++) {
            var variable = _a[_i];
            appendExportsOfBindingElement(variable, newNodes)
        }
    }
    return newNodes
}