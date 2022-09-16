// import { App } from "../app";
import { parseArgs } from "./parseArgs";
// import { runCommands } from "./runCommands";
import { spawn, exec } from "child_process";
// import { isChildPath } from "../utils/isChildPath";
import { chdir } from "process";
import consola from "consola";
import { createTemplate } from "../templates";
import path from "path";
import { runCommands } from "./runCommands";
// const runKeywordForPackage = "APP_RUN_KEYWORD_FOR_PACKAGER"

export const readCommandsAndRun = async () => {
  const argv = await parseArgs()
  // console.log("🚀 --> file: index.ts --> line 10 --> readCommandsAndRun --> argv", argv);

  // console.log("🚀 --> file: index.ts --> line 28 --> readCommandsAndRun --> new", __dirname);
  // console.log("🚀 --> file: index.ts --> line 28 --> readCommandsAndRun --> new", path.resolve("./"));
  runCommands(argv);
  // const 
  // git push --set-upstream origin migration-webpack
  // switch (argv._[0]) {
  //   case "new":
  //     createTemplate()
  //     break;
  //   default:
  //     spawn("npm exec -- npm", [...process.argv.slice(2)], {
  //       shell: true,
  //       stdio: "inherit",
  //     }).on("error", (e) => {
  //       consola.error(e)
  //     });

  // }

}