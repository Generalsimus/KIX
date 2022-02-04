import path from "path"
import { App } from "../app"


export const fileNameToUrlPath = (fileName: string) => {

    return ("./" + path.relative(App.runDirName, fileName)).replace(/(^[\.\.\/]+)|([\\]+)/g, "/")
}

