import path from "path";
import { readIndexHtml } from "./readIndexHtml";
import { ModuleInfoType } from "../utils/createModuleInfo";
// interface AppReqType {
//   mode: "dev" | "prod";
// }

export const App = {
  runDirName: path.resolve("./"),
  indexHTMLUrlPaths: ["/", "/index.html"],
  nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
  requestsThreshold: new Map<string, string>(),
  moduleThree: new Map<string, ModuleInfoType>(),
  devMode: true,
  // addRequesFile(fileName: string, responseValue: string): void {
  //   this.requestsThreshold.set(fileName, responseValue);
  // },
  start() {
    readIndexHtml();
  },
};
