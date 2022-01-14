import path from "path";
import express from "express"
import { readIndexHtml } from "./readIndexHtml";
import { ModuleInfoType } from "../utils/createModuleInfo";
import { resolveKixModule } from "../utils/resolveKixModule";
import { readCommandsAndRun } from "../command";
import { ArgumentsCamelCase } from "yargs";

const runDirName = path.resolve("./");
export const App = {
  runDirName,
  realModuleDirName: path.resolve(__dirname, "../../"),
  port: 2222,
  outDir: "./dist/",
  indexHTMLUrlPaths: ["/", "/index.html"],
  nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
  importModulesAccessKey: `__KIX__IMPORT__MODULE__ACCESS_KEY__${new Date().getTime()}__`,
  windowModuleLocationName: "_KIX" + new Date().getTime(),
  requestsThreshold: new Map<string, express.RequestHandler>(),
  // requestsThreshold: new Map<string, string>(),

  moduleThree: new Map<string, ModuleInfoType>(),
  kixModulePath: resolveKixModule(runDirName),
  devMode: true,
  // ReturnType<typeof yargs>
  parsedArgs: undefined as (ArgumentsCamelCase | undefined),
  start() {
    readCommandsAndRun()
  },
};
