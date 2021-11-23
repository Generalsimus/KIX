import { App } from "../App"

export const getDemoTsConfigObject = () => {
    return {
        compilerOptions: {
            ...App.priorityCompilerOptions,
            module: "amd",
            moduleResolution: "node",
        }
    }
}