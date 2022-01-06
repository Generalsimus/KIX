import fs from "fs";
import path from "path";
import { App } from "..";
import { copyFolderSync } from "../../utils/copyFolderSync";
import { createConfigFiles } from "./createConfigFiles";
import { getConfigJson } from "./getConfigJson"

export const createApp = (projectName: string, templatePath: string) => {
    const newProjectPath = path.join(App.runDirName, projectName)
    if (fs.existsSync(newProjectPath)) {
        throw new Error("A project with that name already exists in: " + App.runDirName);
    }

    copyFolderSync(templatePath, newProjectPath);

    createConfigFiles(projectName, newProjectPath);


}