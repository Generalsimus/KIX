import { App } from "../app";
import path from "path";
import ts from "typescript";

export const createDefaultCompilerOptions = (rootNames: string[]) => {
    // const configIsInsideRunDir = path.resolve(configPath).includes(path.resolve(App.runDirName));
    // console.log("🚀 --> file: createDefaultCompilerOptions.ts --> line 7 --> createDefaultCompilerOptions --> configIsInsideRunDir", !configIsInsideRunDir);

    const compilerOptions: ts.CompilerOptions = {
        rootNames: rootNames,
        noEmit: true,
        allowJs: true,
        checkJs: false,
        jsx: ts.JsxEmit.Preserve,
        module: ts.ModuleKind.ESNext,
        // paths: {
        //   kix: [path.join(path.dirname(App.kixModulePath), "../")], // This mapping is relative to "baseUrl"
        // },
    }
    // if (!configIsInsideRunDir) {
    //     compilerOptions.rootDir = path.join(App.runDirName, "./");
    //     compilerOptions.rootDirs = [path.join(App.runDirName, "./")];

    //     compilerOptions.baseUrl = path.join(App.runDirName, "./");
    //     // compilerOptions.rootDir = App.runDirName;
    //     // compilerOptions.baseUrl = App.runDirName;
    // }
    // console.log("🚀 --> file: createDefaultCompilerOptions.ts --> line 22 --> createDefaultCompilerOptions --> compilerOptions", compilerOptions);
    return compilerOptions
};
