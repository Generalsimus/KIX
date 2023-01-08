import prompts from "prompts"
import { toRgb } from "colby/toRgb";

export enum TemplateTypes {
    JS,
    TS
}
export enum ModuleBuilder {
    WEBPACK,
    VITE
}

export const getPromptsQuestions = async (argvAppName: string | undefined) => {
    const validateProjectName = (value: any) => (!!((value = (value + "").trim()) && /^[a-zA-Z0-9_.-]*$/gm.test(value)));
    // const templateTypes = {
    //     [TemplateTypes.JS]: { path: path.resolve(appDirectory, "./templates/langs/javascript"), indexFile: "index.jsx" },
    //     [TemplateTypes.TS]: { path: path.resolve(appDirectory, "./templates/langs/typescript"), indexFile: "index.tsx" },
    // } as const
    // console.log(rgbToAnsi256(2, 4, 6))

    const appName = (argvAppName && validateProjectName(argvAppName)) ? argvAppName.trim() : await prompts([{
        type: 'text',
        name: 'value',
        message: 'Please specify the project name:',
        validate: (value) => validateProjectName(value)
    }]).then(({ value }): string => value.trim());

    const templateType = await prompts([{
        type: 'select',
        name: 'value',
        message: 'Choose a template',
        choices: [
            { title: toRgb(255, 255, 0)('Javascript Template '), value: TemplateTypes.JS },
            { title: toRgb(0, 122, 204)('Typescript Template '), value: TemplateTypes.TS }
        ]
    }]).then(({ value }): TemplateTypes => value)

    const moduleBuilder = await prompts([{
        type: 'select',
        name: 'value',
        message: 'Select the module builder',
        choices: [
            { title: toRgb(28, 120, 192)("WEBPACK"), value: ModuleBuilder.WEBPACK, description: "Recommended" },
            { title: toRgb(255, 228, 96)("VITE"), value: ModuleBuilder.VITE }
        ]
    }]).then(({ value }): ModuleBuilder => value)

    return {
        appName,
        templateType,
        moduleBuilder
    }
} 