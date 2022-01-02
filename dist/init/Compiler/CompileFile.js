"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.__compiledFilesThreshold = void 0;
const App_1 = require("../App");
const typescript_1 = require("typescript");
const utils_1 = require("../../helpers/utils");
const utils_2 = require("./Transpiler/utils");
const loger_1 = require("../../helpers/loger");
const { __Host, __RunDirName, __ModuleUrlPath, __requestsThreshold } = App_1.App;
const { resetFilesThree } = __Host;
exports.__compiledFilesThreshold = new Map();
const Compiler = (__mainFilesPaths, defaultcompilerOptions = {}, priorityCompilerOptions = {}) => {
    const compilerOptions = {
        ...defaultcompilerOptions,
        __visitedSourceFilesMap: new Map(),
        __mainFilesPaths,
        ...priorityCompilerOptions,
    };
    (0, utils_2.configCompilerOptions)(compilerOptions);
    const __emitProgram = compilerOptions.__emitProgram = () => {
        (0, loger_1.clareLog)({
            "Compiling...": "white"
        });
        compilerOptions.cancellationToken = (0, utils_1.createCancellationToken)();
        (compilerOptions.__oldProgram = (0, typescript_1.createProgram)(__mainFilesPaths, compilerOptions, compilerOptions.__Host, compilerOptions.__oldProgram)).emit(undefined, compilerOptions.writeFile, undefined, undefined, compilerOptions.__transformers);
        for (const mainFilesPath of __mainFilesPaths) {
            exports.__compiledFilesThreshold.set(mainFilesPath, compilerOptions.__oldProgram);
        }
    };
    __emitProgram();
    return compilerOptions;
};
exports.Compiler = Compiler;
