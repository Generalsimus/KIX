import { readCommandsAndRun } from "./command";
import path from "path";

export const appDirectory = path.resolve(__dirname, "../")
export const runDirectory = path.resolve("./");
export const startApp = () => {
    // console.log("AAAAAAAAAA")
    readCommandsAndRun()
};