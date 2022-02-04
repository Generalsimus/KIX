import path from "path";
import express from "express"
import { ModuleInfoType } from "../utils/getModuleInfo";
import { resolveKixModule } from "../utils/resolveKixModule";
import { readCommandsAndRun } from "../command";
import { ArgumentsCamelCase } from "yargs";

const runDirName = path.resolve("./");
const kixModulePath = resolveKixModule(runDirName);
export const App = {
  runDirName,
  realModuleDirName: path.resolve(__dirname, "../../"),
  port: 2222,
  // initServer: false,
  outDir: "./dist/",
  indexHTMLUrlPaths: ["/", "/index.html"],
  nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
  uniqAccessKey: `__KIX_ACCESS_KEY_${new Date().getTime()}_`,
  windowModuleLocationName: "_KIX" + new Date().getTime(),
  requestsThreshold: new Map<string, express.RequestHandler>(),
  moduleThree: new Map<string, ModuleInfoType>(),
  kixModulePath,
  kixModuleTypePath: kixModulePath.slice(0, kixModulePath.lastIndexOf(".")) + ".d.ts",
  devMode: false,
  parsedArgs: undefined as (ArgumentsCamelCase | undefined),
  start() {
    readCommandsAndRun()
  },
};
