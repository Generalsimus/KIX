import { ModuleKind, ModuleResolutionKind } from "typescript"
import { App } from "../App"

export const getDemoTsConfigObject = () => {
    const {
        outDir,
        rootDir,
        baseUrl,
        jsx,
        watch,
        forceConsistentCasingInFileNames,
        suppressOutputPathCheck,
        resolveJsonModule,
        allowSyntheticDefaultImports,
        allowJs,
        sourceMap,
        lib,
        module,
        moduleResolution
    } = App.__compilerOptions
    return {
        compilerOptions: {
            module: ModuleKind.AMD[module],
            moduleResolution: ModuleResolutionKind.NodeJs[moduleResolution],
            outDir,
            rootDir,
            baseUrl,
            jsx,
            watch,
            forceConsistentCasingInFileNames,
            suppressOutputPathCheck,
            resolveJsonModule,
            allowSyntheticDefaultImports,
            allowJs,
            sourceMap,
            lib,
            "noImplicitAny": true,
        },
        "include": [
            "./node_modules/kix/lib/lib.dom.d.ts",
            "./node_modules/kix/lib/lib.dom.iterable.d.ts"
        ],
    }
}