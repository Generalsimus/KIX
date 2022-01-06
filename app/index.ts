import path from "path";
import { readIndexHtml } from "./readIndexHtml";
import { ModuleInfoType } from "../utils/createModuleInfo";
import { resolveKixModule } from "../utils/resolveKixModule";
import { readCommandsAndRun } from "../command";
import yargs, { ArgumentsCamelCase } from "yargs";

const runDirName = path.resolve("./");
export const App = {
  runDirName,
  realModuleDirName: path.resolve(__dirname, "../../"),
  port: 2222,
  outDir: "./dist/",
  indexHTMLUrlPaths: ["/", "/index.html"],
  nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
  requestsThreshold: new Map<string, string>(),
  moduleThree: new Map<string, ModuleInfoType>(),
  kixModulePath: resolveKixModule(runDirName),
  devMode: true,
  // ReturnType<typeof yargs>
  parsedArgs: undefined as (ArgumentsCamelCase | undefined),
  start() {
    readCommandsAndRun()
  },
};
