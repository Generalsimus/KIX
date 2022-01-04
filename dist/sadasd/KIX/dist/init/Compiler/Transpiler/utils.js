"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geModuleLocationMeta = exports.createObjectPropertyLoop = exports.getTransformersObject = exports.configModules = exports.watchModuleFileChange = exports.getOrSetModuleInfo = exports.ModulesThree = exports.resolveModule = exports.defaultModulePaths = void 0;
const typescript_1 = require("typescript");
const resolve_1 = __importDefault(require("resolve"));
const chokidar_1 = __importDefault(require("chokidar"));
const App_1 = require("../../App");
const Module_1 = require("./Module");
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createBlock, createIdentifier, createPropertyAccessExpression, createObjectLiteralExpression, createParameterDeclaration, createParenthesizedExpression, createArrowFunction, createCallExpression, createObjectBindingPattern, createBindingElement } = typescript_1.factory;
exports.defaultModulePaths = {
    "kix": App_1.App.__kixLocalLocation,
    [App_1.App.__kixLocalLocation]: "kix"
};
function resolveModule(modulePath, fileDirectory) {
    try {
        return (0, typescript_1.normalizeSlashes)(resolve_1.default.sync(modulePath, {
            basedir: fileDirectory,
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        }));
    }
    catch (_a) {
        return exports.defaultModulePaths[modulePath];
    }
}
exports.resolveModule = resolveModule;
exports.ModulesThree = new Map();
let Module_INDEX = 1;
const getOrSetModuleInfo = (modulePath, compilerOptions) => {
    const module = exports.ModulesThree.get(modulePath);
    const moduleInfo = module || {
        Module_INDEX: Module_INDEX++,
        __Module_Window_Name: exports.defaultModulePaths[modulePath] ? compilerOptions.__Node_Module_Window_Name : compilerOptions.__Module_Window_Name
    };
    if (!module) {
        exports.ModulesThree.set(modulePath, moduleInfo);
    }
    return moduleInfo;
};
exports.getOrSetModuleInfo = getOrSetModuleInfo;
const watchModuleFileChange = (NODE, moduleInfo, { cancellationToken: { requesteCancell }, changeFileCallback }) => {
    moduleInfo.fileWatcher = chokidar_1.default.watch(NODE.originalFileName).on('change', (event, path) => {
        App_1.App.__Host.deleteFileinThree(NODE.path);
        Module_1.visited_SourceFiles.delete(NODE.originalFileName);
        requesteCancell();
        changeFileCallback();
        App_1.App.server.socketClientSender("RESTART_SERVER", {});
    });
};
exports.watchModuleFileChange = watchModuleFileChange;
const configModules = (NODE, moduleInfo, compilerOptions) => {
    const fileDirectory = (0, typescript_1.getDirectoryPath)(NODE.originalFileName);
    const oldNodeModules = moduleInfo.NodeModules || {};
    const NodeModules = {};
    const LocalModules = {};
    const ModuleColection = NODE.imports.reduce((ModuleColection, ModuleNode) => {
        var _a;
        const { text, parent, kind } = ModuleNode;
        const modulePath = resolveModule(text, fileDirectory);
        if (!modulePath) {
            return ModuleColection;
        }
        const module = exports.ModulesThree.get(modulePath);
        const childModuleInfo = module || {
            Module_INDEX: Module_INDEX++,
            __Module_Window_Name: exports.defaultModulePaths[modulePath] ? compilerOptions.__Node_Module_Window_Name : compilerOptions.__Module_Window_Name
        };
        if (!module) {
            exports.ModulesThree.set(modulePath, childModuleInfo);
        }
        const ModuleKindName = typescript_1.SyntaxKind[(_a = parent === null || parent === void 0 ? void 0 : parent.expression) === null || _a === void 0 ? void 0 : _a.kind];
        childModuleInfo.KindName = ModuleKindName;
        if ((/[/\\]node_modules[/\\]/).test(modulePath)) {
            childModuleInfo.isNodeModule = true;
            childModuleInfo.__Module_Window_Name = compilerOptions.__Node_Module_Window_Name;
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
                    return (transpilerBefore[NODE.kind] || typescript_1.visitEachChild)(NODE, visitor, CTX);
                };
                return visitor;
            }
        ],
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
const geModuleLocationMeta = (ModuleData, compilerOptions) => {
    if (!ModuleData) {
        return;
    }
    const propNode = typescript_1.factory.createNumericLiteral(ModuleData.Module_INDEX);
    return ModuleData.__Module_Window_Name === compilerOptions.__Import_Module_Name ?
        [compilerOptions.__Import_Module_Name, propNode] :
        ["window", typescript_1.factory.createStringLiteral(ModuleData.__Module_Window_Name), propNode];
};
exports.geModuleLocationMeta = geModuleLocationMeta;
