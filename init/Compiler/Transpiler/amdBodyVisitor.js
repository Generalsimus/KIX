import ts, { SyntaxKind } from "typescript"
import { generateFactory } from "./createFactoryCode"
import { getColumnName } from "../../../Helpers/utils"
import { geModuleLocationMeta } from "./utils"

const factory = ts.factory
const { ExportKeyword } = SyntaxKind
const {
    createUniqueName,
    createObjectLiteralExpression,
    createCallExpression,
    createIdentifier
} = factory
const {
    CREATE_Export_File_Function,
    CREATE_Plus_Token_Nodes,
    CREATE_Const_Variable,
    CREATE_Property_Access_Expression,
    CREATE_Equals_Token_Nodes,
    CREATE_Object_Binding_Pattern,
    CREATE_CAll_Function,
    CREATE_Assign_Polyfil,
    CREATE_Property_Access_Equals_Token,
    CREATE_Object_WiTH_String_Keys,
} = generateFactory

function visitor(node) { return node }

export function topLevelVisitor(node, CTX) {
    console.log("🚀 --> file: amdBodyVisitor.js --> line 9 --> topLevelVisitor --> node.kind", node.kind, SyntaxKind[node.kind]);
    switch (node.kind) {
        case SyntaxKind.ImportDeclaration:
            return visitImportDeclaration(node, CTX);
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
function visitImportDeclaration(node, CTX) {
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 54 --> visitImportDeclaration --> node", node);
    // var namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
    const importClause = node.importClause
    if (!node.moduleSpecifier || !importClause) {
        return [node];
    }
    // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX

    const compilerOptions = CTX.getCompilerOptions()
    const constVariablesNameValue = []

    if (ts.isDefaultImport(node)) {
        const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)
        if (ModuleData) {
            ModuleData.push("default")
            constVariablesNameValue.push([
                importClause.name,
                CREATE_Property_Access_Expression(ModuleData)
            ])
        }


    }
    const namedBindings = importClause.namedBindings;
    if (namedBindings && namedBindings.elements) {
        for (const element of namedBindings.elements) {
            const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)

            ModuleData.push(element.propertyName || element.name)
            constVariablesNameValue.push([
                element.name,
                CREATE_Property_Access_Expression(ModuleData)
            ])

        }
    }

    return constVariablesNameValue.length ? CREATE_Const_Variable(constVariablesNameValue) : []

}

function visitExportDeclaration(node, CTX, newNodes = []) {
    const compilerOptions = CTX.getCompilerOptions()
    // delete node.parent
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 50 --> visitExportDeclaration --> node.moduleSpecifier", node);
    // if (!node.moduleSpecifier) {
    //     // Elide export declarations with no module specifier as they are handled
    //     // elsewhere.
    //     return undefined;
    // }

    var generatedName = factory.getGeneratedNameForNode(node);
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 56 --> visitExportDeclaration --> generatedName", generatedName);
    // specifier.propertyName || specifier.name
    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++) {
            var specifier = _a[_i];

            newNodes.push(CREATE_Equals_Token_Nodes([
                CREATE_Property_Access_Expression(["exports", specifier.name]),
                specifier.propertyName || specifier.name
            ]))

        }
    } else if (node.exportClause) {
        // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX

        const ModuleData = geModuleLocationMeta(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions)
        // if (typeof Module_INDEX !== "number") {
        //     return newNodes
        // }
        newNodes.push(CREATE_Equals_Token_Nodes([
            CREATE_Property_Access_Expression(["exports", node.exportClause.name]),
            (
                (ModuleData) ?
                    CREATE_Property_Access_Expression(ModuleData) :
                    createIdentifier("undefined")
            )
        ]))

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
                        CREATE_Property_Access_Expression(ModuleData) :
                        createObjectLiteralExpression([], false)
                )
            ]
        ))

        // export * from "mod";
    }
    return newNodes
}


function visitExportAssignment(node) {
    return [CREATE_Equals_Token_Nodes([
        CREATE_Property_Access_Expression(["exports", "default"]),
        node.expression
    ])]
}

function appendExportsOfBindingElement(decl, nodes) {
    if (ts.isBindingPattern(decl.name)) {
        for (var _i = 0, _a = decl.name.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (!ts.isOmittedExpression(element)) {
                appendExportsOfBindingElement(element, nodes);
            }
        }
    }
    else if (!ts.isGeneratedIdentifier(decl.name)) {
        nodes.push(CREATE_Equals_Token_Nodes([
            CREATE_Property_Access_Expression(["exports", decl.name]),
            decl.name
        ]))
    }
}
function checkModiferAndHaveExport(node, newNodes = [node]) {
    if (
        node.modifiers &&
        node.modifiers.some(({ kind }) => ts.SyntaxKind.ExportKeyword === kind)
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
        node.modifiers.some(({ kind }) => ts.SyntaxKind.ExportKeyword === kind)
    ) {
        for (var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++) {
            var variable = _a[_i];
            appendExportsOfBindingElement(variable, newNodes)
        }
    }
    return newNodes
}