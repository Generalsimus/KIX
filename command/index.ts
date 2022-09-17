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

export const readCommandsAndRun = async () => {
  const argv = await parseArgs()

  runCommands(argv);


}