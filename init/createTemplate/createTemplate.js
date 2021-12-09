import { App } from "../App"
import prompts from "prompts"
import path from "path"
import { copyFolderSync } from "../../helpers/copyFolderSync"
import { spawn } from "child_process"
import fs from "fs"
import { getDemoPackageObject } from "./demo_package"
import { getDemoTsConfigObject } from "./demo_tsconfig"
import { clareLog } from "../../helpers/loger"

export const createTemplate = () => {
    const appName = App.__args._[App.__args._.indexOf("new") + 1]
    if (validate(appName)) {
        chooseAppTemplate(appName)
    } else {
        prompts([{
            type: 'text',
            name: 'value',
            message: 'Please specify the project name:',
            validate: (value) => validate(value.trim())
        }]).then(function ({ value }) {

            chooseAppTemplate(value.trim())
        })
    }
}
const validate = (value) => (value && /^[a-zA-Z0-9_.-]*$/gm.test(value))




const chooseAppTemplate = (appName) => {
    prompts([{
        type: 'select',
        name: 'value',
        message: 'Choose a template',
        choices: [
            { title: 'Javascript Template ', value: 'JS' },
            { title: 'Typescript Template ', value: 'TS' }
        ],

    }]).then(function ({ value }) {
        const appTemplatlocation = path.join(App.__RunDirName, appName)
        copyFolderSync(
            path.join(__dirname, "../../../demoTemplates", value),
            appTemplatlocation
        )



        fs.writeFileSync(path.join(appTemplatlocation, "package.json"), JSON.stringify(getDemoPackageObject(appName), null, 4), "utf8")
        fs.writeFileSync(path.join(appTemplatlocation, "tsconfig.json"), JSON.stringify(getDemoTsConfigObject(), null, 4), "utf8")


        spawn('npm', ["install"], {
            cwd: appTemplatlocation,
            shell: true,
            stdio: 'inherit'
        }).on("close", () => {
            clareLog({
                [`Project "${appName}" Created`]: "green",
                [`\nLocation: ` + appTemplatlocation]: "white"
            })
        });


    })

}
