import prompts from "prompts"
import path from "path"
import { appDirectory } from "../app";
import fs from "fs"
import consola from "consola";

export const getPromptsQuestions = async () => {
    const validateProjectName = (value: any): boolean => (value && /^[a-zA-Z0-9_.-]*$/gm.test(value))


    const appName = await prompts([{
        type: 'text',
        name: 'value',
        message: 'Please specify the project name:',
        validate: (value) => validateProjectName(value.trim())
    }]).then(({ value }) => value.trim());

    const appCopyDirectory = await prompts([{
        type: 'select',
        name: 'value',
        message: 'Choose a template',
        choices: [
            { title: 'Javascript Template ', value: path.join(appDirectory, "./templates/langs/javascript") },
            { title: 'Typescript Template ', value: path.join(appDirectory, "./templates/langs/typescript") }
        ]
    }]).then(({ value }) => {
        if (!fs.existsSync(value)) {
            throw consola.error(`template not found \n at(${value})`)
        }
        return value
    })

    // console.log("ZZZZ", {
    //     appName,
    //     appCopyDirectory
    // })
    return {
        appName,
        appCopyDirectory
    }
}