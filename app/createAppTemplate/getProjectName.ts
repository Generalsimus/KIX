import prompts from "prompts"
import { App } from "../"



export const getProjectName = (): Promise<string> => {
    const validateProjectName = (value: any): boolean => (value && /^[a-zA-Z0-9_.-]*$/gm.test(value))


    return new Promise((resolve) => {

        if (validateProjectName(App.parsedArgs?._[1])) {
            resolve(App.parsedArgs?._[1] + "")
        } else {
            prompts([{
                type: 'text',
                name: 'value',
                message: 'Please specify the project name:',
                validate: (value) => validateProjectName(value.trim())
            }]).then(function ({ value }) {
                resolve(value.trim())
            })
        }

    })
}