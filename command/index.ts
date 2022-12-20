import { parseArgs } from "./parseArgs"; 
import { runCommands } from "./runCommands";

export const readCommandsAndRun = async () => {
  const argv = await parseArgs()

  runCommands(argv);


}