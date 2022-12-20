import prompts from "prompts"
import path from "path"
import { appDirectory } from "../app";
import fs from "fs"
import { log } from "../utils/log";


export const getPromptsQuestions = async (argvAppName: string | undefined) => {
    const validateProjectName = (value: any): boolean => ((value = value.trim()) && /^[a-zA-Z0-9_.-]*$/gm.test(value));
    const templateTypes: Record<string, undefined | { path: string, indexFile: string }> = {
        js: { path: path.resolve(appDirectory, "./templates/langs/javascript"), indexFile: "index.jsx" },
        ts: { path: path.resolve(appDirectory, "./templates/langs/typescript"), indexFile: "index.tsx" },
    }


    const appName = (argvAppName && validateProjectName(argvAppName)) ? argvAppName.trim() : await prompts([{
        type: 'text',
        name: 'value',
        message: 'Please specify the project name:',
        validate: (value) => validateProjectName(value)
    }]).then(({ value }) => value.trim());

    const appConfigLocation = await prompts([{
        type: 'select',
        name: 'value',
        message: 'Choose a template',
        choices: [
            { title: 'Javascript Template ', value: "js" },
            { title: 'Typescript Template ', value: "ts" }
        ]
    }]).then(({ value }) => {
        const appConfig = templateTypes[String(value)]
        const { path: filePath, indexFile } = appConfig || {}

        if (!appConfig) {
            throw log.error(`template not found`)
        }
        if (!fs.existsSync(filePath!)) {
            throw log.error(`template not found \n at(${path})`)
        }
        const indexFilePath = path.resolve(filePath!, indexFile!)
        if (!indexFilePath) {
            throw log.error(`template not found \n at(${indexFilePath})`)
        }
        return appConfig
    })


    return {
        appName,
        ...appConfigLocation
    }
} 