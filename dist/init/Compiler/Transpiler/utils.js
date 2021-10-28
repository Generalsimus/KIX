"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectPropertyLoop = exports.getTransformersObject = exports.configModules = exports.getOrSetModuleInfo = exports.ModulesThree = void 0;
const typescript_1 = require("typescript");
const resolve_1 = __importDefault(require("resolve"));
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createBlock, createIdentifier, createPropertyAccessExpression, createObjectLiteralExpression, createParameterDeclaration, createParenthesizedExpression, createArrowFunction, createCallExpression, createObjectBindingPattern, createBindingElement } = typescript_1.factory;
// მოდულის შესახებ ინფორმაციის ქეშირება
exports.ModulesThree = new Map();
let Module_INDEX = 0;
const getOrSetModuleInfo = (pathKey) => {
    const module = exports.ModulesThree.get(pathKey);
    const moduleInfo = module || {
        Module_INDEX: Module_INDEX++
    };
    if (!module) {
        exports.ModulesThree.set(pathKey, moduleInfo);
    }
    return moduleInfo;
};
exports.getOrSetModuleInfo = getOrSetModuleInfo;
const configModules = (NODE, moduleInfo, compilerOptions) => {
    const fileDirectory = (0, typescript_1.getDirectoryPath)(NODE.originalFileName);
    const oldNodeModules = moduleInfo.NodeModules || {};
    const NodeModules = {};
    const LocalModules = {};
    const ModuleColection = NODE.imports.reduce((ModuleColection, ModuleNode) => {
        const { text, parent, kind } = ModuleNode;
        const modulePath = resolveModule(text, fileDirectory);
        if (!modulePath) {
            return ModuleColection;
        }
        const module = exports.ModulesThree.get(modulePath);
        const childModuleInfo = module || {
            Module_INDEX: Module_INDEX++
        };
        if (!module) {
            exports.ModulesThree.set(modulePath, childModuleInfo);
        }
        const ModuleKindName = typescript_1.SyntaxKind[parent?.expression?.kind];
        childModuleInfo.KindName = ModuleKindName;
        if ((/[/\\]node_modules[/\\]/).test(modulePath)) {
            childModuleInfo.isNodeModule = true;
            NodeModules[modulePath] = childModuleInfo;
            if (!oldNodeModules[modulePath]) {
                compilerOptions.resetModuleFiles();
            }
        }
        else {
            LocalModules[modulePath] = childModuleInfo;
        }
        ModuleColection[text] = childModuleInfo;
        return ModuleColection;
    }, {});
    moduleInfo.ModuleColection = ModuleColection;
    moduleInfo.NodeModules = NodeModules;
    moduleInfo.LocalModules = LocalModules;
    return ModuleColection;
};
exports.configModules = configModules;
function resolveModule(modulePath, fileDirectory) {
    try {
        return (0, typescript_1.normalizeSlashes)(resolve_1.default.sync(modulePath, {
            basedir: fileDirectory,
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        }));
    }
    catch (e) {
    }
}
const concatBeforOrAfterTransformers = (BeforeOrAfter, transfromers = {}) => {
    for (const transformersObject of BeforeOrAfter) {
        for (const transfromersKey in transformersObject)
            if (transfromersKey in transfromers) {
                const transfromer = transfromers[transfromersKey];
                const newtransfromer = transformersObject[transfromersKey];
                transfromers[transfromersKey] = (node, ...args) => newtransfromer(transfromer(node, ...args), ...args);
            }
            else {
                transfromers[transfromersKey] = transformersObject[transfromersKey];
            }
    }
    return transfromers;
};
const getTransformersObject = (before, after) => {
    const transpilerBefore = concatBeforOrAfterTransformers(before);
    const transpilerAfter = concatBeforOrAfterTransformers(after);
    return {
        before: [
            (CTX) => {
                const visitor = (NODE) => {
                    // console.log(SyntaxKind[NODE.kind])
                    // return visitEachChild(NODE, visitor, CTX)
                    return (transpilerBefore[NODE.kind] || typescript_1.visitEachChild)(NODE, visitor, CTX);
                };
                return visitor;
            }
        ],
        // after: [
        //     (CTX) => {
        //         const visitor = (NODE) => {
        //             // console.log(SyntaxKind[NODE.kind])
        //             return (transpilerAfter[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
        //         }
        //         return visitor
        //     }
        // ]
    };
};
exports.getTransformersObject = getTransformersObject;
const createObjectPropertyLoop = (namesObject, returnValue = []) => {
    for (const nameKey in namesObject) {
        const value = namesObject[nameKey];
        returnValue.push(createBindingElement(undefined, value && createIdentifier(nameKey), value && (0, exports.createObjectPropertyLoop)(value) || createIdentifier(nameKey), undefined));
    }
    return createObjectBindingPattern(returnValue);
};
exports.createObjectPropertyLoop = createObjectPropertyLoop;
//# sourceMappingURL=utils.js.map