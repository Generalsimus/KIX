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
        checkJs,
        moduleResolution
    } = App.__compilerOptions
    return {
        compilerOptions: {
            module: ModuleKind.AMD[module],
            moduleResolution: ModuleResolutionKind.NodeJs[moduleResolution],
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
    }
}