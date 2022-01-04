"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creaePrgram = void 0;
const typescript_1 = __importDefault(require("typescript"));
const __1 = require("../..");
const reportDiagnostic_1 = require("../../../utils/reportDiagnostic");
const createModuleNamesResolver_1 = require("../../../utils/createModuleNamesResolver");
const creaePrgram = (rootNames) => {
    const configPath = typescript_1.default.findConfigFile(__1.App.runDirName, typescript_1.default.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const host = typescript_1.default.createWatchCompilerHost(configPath, {
        rootNames: rootNames,
        noEmit: true,
        allowJs: true,
        checkJs: false,
    }, typescript_1.default.sys, typescript_1.default.createSemanticDiagnosticsBuilderProgram, reportDiagnostic_1.reportDiagnostic, () => { });
    host.resolveModuleNames = (0, createModuleNamesResolver_1.createModuleNamesResolver)(host);
    host.getSourceFile = (fileName, languageVersion) => { };
    return typescript_1.default.createWatchProgram(host);
};
exports.creaePrgram = creaePrgram;
