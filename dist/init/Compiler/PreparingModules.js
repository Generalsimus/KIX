"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreparingModules = void 0;
const typescript_1 = __importDefault(require("typescript"));
const App_1 = require("../App");
function PreparingModules(file) {
    const options = App_1.App.__compilerOptions;
    if (file.imports) {
        return;
    }
    var isJavaScriptFile = typescript_1.default.isSourceFileJS(file);
    var isExternalModuleFile = typescript_1.default.isExternalModule(file);
    console.log("🚀 ---> file: PreparingModules.js ---> line 15 ---> PreparingModules ---> isExternalModuleFile", isExternalModuleFile);
    // file.imports may not be undefined if there exists dynamic import
    var imports;
    var moduleAugmentations;
    var ambientModules;
    // If we are importing helpers, we need to add a synthetic reference to resolve the
    // helpers library.
    if ((options.isolatedModules || isExternalModuleFile)
        && !file.isDeclarationFile) {
        if (options.importHelpers) {
            // synthesize 'import "tslib"' declaration
            imports = [createSyntheticImport(typescript_1.default.externalHelpersModuleNameText, file)];
        }
        var jsxImport = typescript_1.default.getJSXRuntimeImport(typescript_1.default.getJSXImplicitImportBase(options, file), options);
        if (jsxImport) {
            // synthesize `import "base/jsx-runtime"` declaration
            (imports || (imports = [])).push(createSyntheticImport(jsxImport, file));
        }
    }
    for (var _i = 0, _a = file.statements; _i < _a.length; _i++) {
        var node = _a[_i];
        collectModuleReferences(node, /*inAmbientModule*/ false);
    }
    if ((file.flags & 1048576 /* PossiblyContainsDynamicImport */) || isJavaScriptFile) {
        collectDynamicImportOrRequireCalls(file);
    }
    file.imports = imports || typescript_1.default.emptyArray;
    file.moduleAugmentations = moduleAugmentations || typescript_1.default.emptyArray;
    file.ambientModuleNames = ambientModules || typescript_1.default.emptyArray;
    return;
    function collectModuleReferences(node, inAmbientModule) {
        if (typescript_1.default.isAnyImportOrReExport(node)) {
            var moduleNameExpr = typescript_1.default.getExternalModuleName(node);
            // TypeScript 1.0 spec (April 2014): 12.1.6
            // An ExternalImportDeclaration in an AmbientExternalModuleDeclaration may reference other external modules
            // only through top - level external module names. Relative external module names are not permitted.
            if (moduleNameExpr && typescript_1.default.isStringLiteral(moduleNameExpr) && moduleNameExpr.text && (!inAmbientModule || !typescript_1.default.isExternalModuleNameRelative(moduleNameExpr.text))) {
                imports = typescript_1.default.append(imports, moduleNameExpr);
            }
        }
        else if (typescript_1.default.isModuleDeclaration(node)) {
            if (typescript_1.default.isAmbientModule(node) && (inAmbientModule || typescript_1.default.hasSyntacticModifier(node, 2 /* Ambient */) || file.isDeclarationFile)) {
                var nameText = typescript_1.default.getTextOfIdentifierOrLiteral(node.name);
                // Ambient module declarations can be interpreted as augmentations for some existing external modules.
                // This will happen in two cases:
                // - if current file is external module then module augmentation is a ambient module declaration defined in the top level scope
                // - if current file is not external module then module augmentation is an ambient module declaration with non-relative module name
                //   immediately nested in top level ambient module declaration .
                if (isExternalModuleFile || (inAmbientModule && !typescript_1.default.isExternalModuleNameRelative(nameText))) {
                    (moduleAugmentations || (moduleAugmentations = [])).push(node.name);
                }
                else if (!inAmbientModule) {
                    if (file.isDeclarationFile) {
                        // for global .d.ts files record name of ambient module
                        (ambientModules || (ambientModules = [])).push(nameText);
                    }
                    // An AmbientExternalModuleDeclaration declares an external module.
                    // This type of declaration is permitted only in the global module.
                    // The StringLiteral must specify a top - level external module name.
                    // Relative external module names are not permitted
                    // NOTE: body of ambient module is always a module block, if it exists
                    var body = node.body;
                    if (body) {
                        for (var _i = 0, _a = body.statements; _i < _a.length; _i++) {
                            var statement = _a[_i];
                            collectModuleReferences(statement, /*inAmbientModule*/ true);
                        }
                    }
                }
            }
        }
    }
    function collectDynamicImportOrRequireCalls(file) {
        var r = /import|require/g;
        while (r.exec(file.text) !== null) { // eslint-disable-line no-null/no-null
            var node = getNodeAtPosition(file, r.lastIndex);
            if (isJavaScriptFile && typescript_1.default.isRequireCall(node, /*checkArgumentIsStringLiteralLike*/ true)) {
                imports = typescript_1.default.append(imports, node.arguments[0]);
            }
            // we have to check the argument list has length of 1. We will still have to process these even though we have parsing error.
            else if (typescript_1.default.isImportCall(node) && node.arguments.length === 1 && typescript_1.default.isStringLiteralLike(node.arguments[0])) {
                imports = typescript_1.default.append(imports, node.arguments[0]);
            }
            else if (typescript_1.default.isLiteralImportTypeNode(node)) {
                imports = typescript_1.default.append(imports, node.argument.literal);
            }
        }
    }
    /** Returns a token if position is in [start-of-leading-trivia, end), includes JSDoc only in JS files */
    function getNodeAtPosition(sourceFile, position) {
        var current = sourceFile;
        var getContainingChild = function (child) {
            if (child.pos <= position && (position < child.end || (position === child.end && (child.kind === 1 /* EndOfFileToken */)))) {
                return child;
            }
        };
        while (true) {
            var child = isJavaScriptFile && typescript_1.default.hasJSDocNodes(current) && typescript_1.default.forEach(current.jsDoc, getContainingChild) || typescript_1.default.forEachChild(current, getContainingChild);
            if (!child) {
                return current;
            }
            current = child;
        }
    }
}
exports.PreparingModules = PreparingModules;
