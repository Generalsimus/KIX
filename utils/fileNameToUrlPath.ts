import path from "path" 
import { runDirectory } from "../app"


export const fileNameToUrlPath = (fileName: string) => {

    return ("./" + path.relative(runDirectory, fileName)).replace(/(^[\.\.\/]+)|([\\]+)/g, "/")
}

