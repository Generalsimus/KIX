import path from "path"
import fs from "fs"
import { getConfigJson } from "./getConfigJson"

export const createConfigFiles = (projectName: string, projectPath: string) => {
    const configJson = getConfigJson(projectName)

    const tsConfig = JSON.stringify(configJson.tsConfig, null, 4)
    const packageJson = JSON.stringify(configJson.packageJson, null, 4)

    fs.writeFileSync(path.join(projectPath, "package.json"), tsConfig, "utf8")
    fs.writeFileSync(path.join(projectPath, "tsconfig.json"), packageJson, "utf8")
}