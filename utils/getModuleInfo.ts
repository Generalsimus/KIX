import ts from "typescript";
import { App } from "../app";
import { isPathNodeModule } from "./isPathNodeModule";
import chokidar from "chokidar";
import { rootWriter } from "../app/rootWriter";
import { string } from "yargs";

export type rootWritersType = {
  [key: string]: rootWritersType | rootWriter;
}
export type ModuleInfoType = {
  modulePath: string;
  moduleIndex: number;
  moduleCollection: Record<string, ModuleInfoType>;
  resolvedModuleNames?: (ts.ResolvedModule | undefined)[]
  resolvedModule?: ts.ResolvedModule;
  isNodeModule: boolean;
  // writers: Record<string, RootWriterCacheType>,
  // rootWriter?: rootWriter
  rootWriters: rootWritersType
  // RootWriterCacheType
};

let globalModuleIndex = 1;
export const getModuleInfo = (modulePath: string, defaultOption: Partial<ModuleInfoType> = {}): ModuleInfoType => {
  let moduleInfo = App.moduleThree.get(modulePath)


  if (!moduleInfo) {
    App.moduleThree.set(modulePath, (moduleInfo = {
      modulePath,
      moduleIndex: globalModuleIndex++,
      moduleCollection: {},
      isNodeModule: isPathNodeModule(modulePath),
      rootWriters: {},
      ...defaultOption
    }))
  }

  // App.moduleThree
  return moduleInfo;
};
