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
exports.topLevelVisitor = void 0;
const typescript_1 = __importStar(require("typescript"));
const createFactoryCode_1 = require("./createFactoryCode");
const utils_1 = require("./utils");
const factory = typescript_1.default.factory;
const { ExportKeyword } = typescript_1.SyntaxKind;
const { createUniqueName, createObjectLiteralExpression, createCallExpression, createIdentifier } = factory;
const { CREATE_Export_File_Function, CREATE_Plus_Token_Nodes, CREATE_Const_Variable, CREATE_Property_Access_Expression, CREATE_Equals_Token_Nodes, CREATE_Object_Binding_Pattern, CREATE_CAll_Function, CREATE_Assign_Polyfil, CREATE_Property_Access_Equals_Token, CREATE_Object_WiTH_String_Keys, } = createFactoryCode_1.generateFactory;
function visitor(node) { return node; }
function topLevelVisitor(node, CTX) {
    console.log("🚀 --> file: amdBodyVisitor.js --> line 9 --> topLevelVisitor --> node.kind", node.kind, typescript_1.SyntaxKind[node.kind]);
    switch (node.kind) {
        case typescript_1.SyntaxKind.ImportDeclaration:
            return visitImportDeclaration(node, CTX);
        // case 263:
        //     return visitImportEqualsDeclaration(node);
        case typescript_1.SyntaxKind.ExportDeclaration:
            return visitExportDeclaration(node, CTX);
        case typescript_1.SyntaxKind.ExportAssignment:
            return visitExportAssignment(node);
        case typescript_1.SyntaxKind.FirstStatement:
            return visitVariableStatement(node);
        case typescript_1.SyntaxKind.FunctionDeclaration:
            return visitFunctionDeclaration(node);
        case typescript_1.SyntaxKind.ClassDeclaration:
            return visitClassDeclaration(node);
        // case 347:
        //     return visitMergeDeclarationMarker(node);
        // case 348:
        //     return visitEndOfDeclarationMarker(node);
        default:
            return [node];
    }
}
exports.topLevelVisitor = topLevelVisitor;
function visitImportDeclaration(node, CTX) {
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 54 --> visitImportDeclaration --> node", node);
    // var namespaceDeclaration = ts.getNamespaceDeclarationNode(node);
    const importClause = node.importClause;
    if (!node.moduleSpecifier || !importClause) {
        return [node];
    }
    // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX
    const compilerOptions = CTX.getCompilerOptions();
    const constVariablesNameValue = [];
    if (typescript_1.default.isDefaultImport(node)) {
        const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions);
        if (ModuleData) {
            ModuleData.push("default");
            constVariablesNameValue.push([
                importClause.name,
                CREATE_Property_Access_Expression(ModuleData)
            ]);
        }
    }
    const namedBindings = importClause.namedBindings;
    if (namedBindings && namedBindings.elements) {
        for (const element of namedBindings.elements) {
            const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions);
            ModuleData.push(element.propertyName || element.name);
            constVariablesNameValue.push([
                element.name,
                CREATE_Property_Access_Expression(ModuleData)
            ]);
        }
    }
    return constVariablesNameValue.length ? CREATE_Const_Variable(constVariablesNameValue) : [];
}
function visitExportDeclaration(node, CTX, newNodes = []) {
    const compilerOptions = CTX.getCompilerOptions();
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
    if (node.exportClause && typescript_1.default.isNamedExports(node.exportClause)) {
        for (var _i = 0, _a = node.exportClause.elements; _i < _a.length; _i++) {
            var specifier = _a[_i];
            newNodes.push(CREATE_Equals_Token_Nodes([
                CREATE_Property_Access_Expression(["exports", specifier.name]),
                specifier.propertyName || specifier.name
            ]));
        }
    }
    else if (node.exportClause) {
        // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX
        const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions);
        // if (typeof Module_INDEX !== "number") {
        //     return newNodes
        // }
        newNodes.push(CREATE_Equals_Token_Nodes([
            CREATE_Property_Access_Expression(["exports", node.exportClause.name]),
            ((ModuleData) ?
                CREATE_Property_Access_Expression(ModuleData) :
                createIdentifier("undefined"))
        ]));
        // export * as ns from "mod";
        // export * as default from "mod";
    }
    else {
        // const Module_INDEX = CTX.ModuleColection[node.moduleSpecifier.text]?.Module_INDEX
        const ModuleData = (0, utils_1.geModuleLocationMeta)(CTX.ModuleColection[node.moduleSpecifier.text], compilerOptions);
        CTX.assignPolyfill = createUniqueName(compilerOptions.__Import_Module_Name + "_Assign");
        newNodes.push(createCallExpression((CTX.assignPolyfill), undefined, [
            createIdentifier("exports"),
            ((ModuleData) ?
                CREATE_Property_Access_Expression(ModuleData) :
                createObjectLiteralExpression([], false))
        ]));
        // export * from "mod";
    }
    return newNodes;
}
function visitExportAssignment(node) {
    return [CREATE_Equals_Token_Nodes([
            CREATE_Property_Access_Expression(["exports", "default"]),
            node.expression
        ])];
}
function appendExportsOfBindingElement(decl, nodes) {
    if (typescript_1.default.isBindingPattern(decl.name)) {
        for (var _i = 0, _a = decl.name.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (!typescript_1.default.isOmittedExpression(element)) {
                appendExportsOfBindingElement(element, nodes);
            }
        }
    }
    else if (!typescript_1.default.isGeneratedIdentifier(decl.name)) {
        nodes.push(CREATE_Equals_Token_Nodes([
            CREATE_Property_Access_Expression(["exports", decl.name]),
            decl.name
        ]));
    }
}
function checkModiferAndHaveExport(node, newNodes = [node]) {
    if (node.modifiers &&
        node.modifiers.some(({ kind }) => typescript_1.default.SyntaxKind.ExportKeyword === kind)) {
        appendExportsOfBindingElement(node, newNodes);
    }
    return newNodes;
}
function visitClassDeclaration(node) {
    return checkModiferAndHaveExport(node);
}
function visitFunctionDeclaration(node) {
    return checkModiferAndHaveExport(node);
}
function visitVariableStatement(node, newNodes = [node]) {
    if (node.modifiers &&
        node.modifiers.some(({ kind }) => typescript_1.default.SyntaxKind.ExportKeyword === kind)) {
        for (var _i = 0, _a = node.declarationList.declarations; _i < _a.length; _i++) {
            var variable = _a[_i];
            appendExportsOfBindingElement(variable, newNodes);
        }
    }
    return newNodes;
}
//# sourceMappingURL=amdBodyVisitor.js.map