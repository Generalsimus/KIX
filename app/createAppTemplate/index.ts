import prompts from "prompts"
import { chooseTemplate } from "./chooseTemplate"
import { createApp } from "./createApp"
import { getProjectName } from "./getProjectName"

export const createAppTemplate = async () => {
    const projectName = await getProjectName()
    const templatePath = await chooseTemplate()

    createApp(projectName, templatePath)

}