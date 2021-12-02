"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoTsConfigObject = void 0;
const typescript_1 = require("typescript");
const App_1 = require("../App");
const getDemoTsConfigObject = () => {
    const { outDir, rootDir, baseUrl, jsx, watch, forceConsistentCasingInFileNames, suppressOutputPathCheck, resolveJsonModule, allowSyntheticDefaultImports, allowJs, sourceMap, lib, module, checkJs, moduleResolution } = App_1.App.__compilerOptions;
    return {
        compilerOptions: {
            module: typescript_1.ModuleKind.AMD[module],
            moduleResolution: typescript_1.ModuleResolutionKind.NodeJs[moduleResolution],
            outDir,
            rootDir,
            baseUrl,
            // jsx,
            "jsx": "preserve",
            watch,
            forceConsistentCasingInFileNames,
            // suppressOutputPathCheck,
            resolveJsonModule,
            allowSyntheticDefaultImports,
            allowJs,
            checkJs: !!checkJs,
            sourceMap,
            lib,
            "noImplicitAny": true,
        },
        "include": [
            "./node_modules/kix/lib/kix.dom.d.ts",
            "./node_modules/kix/lib/kix.dom.iterable.d.ts"
        ],
    };
};
exports.getDemoTsConfigObject = getDemoTsConfigObject;
