"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplate = void 0;
const App_1 = require("./App");
const prompts_1 = __importDefault(require("prompts"));
const path_1 = __importDefault(require("path"));
const copyFolderSync_1 = require("../Helpers/copyFolderSync");
const createTemplate = () => {
    const appName = App_1.App.__args._[App_1.App.__args._.indexOf("new") + 1];
    if (validate(appName)) {
        chooseAppTemplate(appName);
    }
    else {
        (0, prompts_1.default)([{
                type: 'text',
                name: 'value',
                message: 'Please specify the project name:',
                validate: validate
            }]).then(function ({ value }) {
            chooseAppTemplate(value);
        });
    }
};
exports.createTemplate = createTemplate;
const validate = (value) => (value && /^[a-zA-Z0-9_.-]*$/gm.test(value));
const chooseAppTemplate = (appName) => {
    (0, prompts_1.default)([{
            type: 'select',
            name: 'value',
            message: 'Choose a template',
            choices: [
                { title: 'Javascript Template ', value: 'JS' },
                { title: 'Typescript Template ', value: 'TS' }
            ],
        }]).then(function ({ value }) {
        const appTemplatlocation = path_1.default.join(App_1.App.__RunDirName, appName);
        (0, copyFolderSync_1.copyFolderSync)(path_1.default.join(__dirname, "../../demoTemplates", value), appTemplatlocation);
        // 
        const { exec } = require("child_process");
        exec(`npm --prefix ${appTemplatlocation} install`, (error, stdout, stderr) => {
            console.log(stdout);
        });
    });
};
const defaultCompilerOptions = {};
