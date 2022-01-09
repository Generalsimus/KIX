import path from "path"
import fs from "fs"
import { getConfigJson } from "./getConfigJson"
import { spawn } from 'child_process'
import { clareLog } from "../utils/loger"

export const createConfigFiles = (projectName: string, projectPath: string) => {
    const configJson = getConfigJson(projectName)

    const tsConfig = JSON.stringify(configJson.tsConfig, null, 4)
    const packageJson = JSON.stringify(configJson.packageJson, null, 4)

    fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsConfig, "utf8")
    fs.writeFileSync(path.join(projectPath, "package.json"), packageJson, "utf8")


    spawn('npm', ["install"], {
        cwd: projectPath,
        shell: true,
        stdio: 'inherit'
    }).on("close", () => {
        clareLog({
            [`Project "${projectName}" Created`]: "green",
            [`\nLocation: ` + projectPath]: "white"
        })
    });
}