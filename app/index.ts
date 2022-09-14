import { readCommandsAndRun } from "../command";
import path from "path";

export const appDirectory = path.join(__dirname, "../../")
export const runDirectory = path.resolve("./");
export const startApp = () => {
    // console.log("AAAAAAAAAA")
    readCommandsAndRun()
};
