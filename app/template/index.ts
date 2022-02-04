import path from "path"
import prompts from "prompts"
import { chooseTemplate } from "./chooseTemplate" 
import { getProjectName } from "./getProjectName"
import fs from 'fs';
import { copyFolderSync } from "../../utils/copyFolderSync"
import { createConfigFiles } from "./createConfigFiles"
import { App } from ".."
export const createAppTemplate = async () => {
    const projectName = await getProjectName()
    const templatePath = await chooseTemplate()

    // createApp(projectName, templatePath)
    const newProjectPath = path.join(App.runDirName, projectName)
    if (fs.existsSync(newProjectPath)) {
        throw new Error("A project with that name already exists in: " + App.runDirName);
    }

    copyFolderSync(templatePath, newProjectPath);

    createConfigFiles(projectName, newProjectPath);


}