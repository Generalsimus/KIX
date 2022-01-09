import path from "path"
import prompts from "prompts"
import fs from "fs"
import { spawn } from "child_process"
import { App } from "../app"

export const chooseTemplate = (): Promise<string> => {
    return prompts([{
        type: 'select',
        name: 'value',
        message: 'Choose a template',
        choices: [
            { title: 'Javascript Template ', value: path.join(App.realModuleDirName, "./createAppTemplate/demoTemplates/JS") },
            { title: 'Typescript Template ', value: path.join(App.realModuleDirName, "./createAppTemplate/demoTemplates/TS") }
        ],

    }]).then(function ({ value: valueTemplatePath }) {


        if (!fs.existsSync(valueTemplatePath)) {
            throw new Error("template not found")
        }

        return valueTemplatePath
        // const appTemplatlocation = path.join(App.__RunDirName, appName)
        // copyFolderSync(
        //     path.join(__dirname, "../../../demoTemplates", value),
        //     appTemplatlocation
        // )



        // fs.writeFileSync(path.join(appTemplatlocation, "package.json"), JSON.stringify(getDemoPackageObject(appName), null, 4), "utf8")
        // fs.writeFileSync(path.join(appTemplatlocation, "tsconfig.json"), JSON.stringify(getDemoTsConfigObject(), null, 4), "utf8")

        // spawn('npm', ["install"], {
        //     cwd: valueTemplatePath,
        //     shell: true,
        //     stdio: 'inherit'
        // }).on("close", () => {
        //     clareLog({
        //         [`Project "${appName}" Created`]: "green",
        //         [`\nLocation: ` + appTemplatlocation]: "white"
        //     })
        // });

    })

}