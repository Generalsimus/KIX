import path from "path"
import { App } from "../app"

const exMsTime = new Date().getTime();
export const fileNameToUrlPath = (filePath: string) => {

    return ("./" + path.relative(App.runDirName, filePath.replace(/\.tsx?$/, exMsTime + ".js"))).replace(/(^[\.\.\/]+)|([\\]+)/g, "/")

} 