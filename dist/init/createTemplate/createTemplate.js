"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplate = void 0;
const App_1 = require("../App");
const prompts_1 = __importDefault(require("prompts"));
const path_1 = __importDefault(require("path"));
const copyFolderSync_1 = require("../../helpers/copyFolderSync");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const demo_package_1 = require("./demo_package");
const demo_tsconfig_1 = require("./demo_tsconfig");
const loger_1 = require("../../helpers/loger");
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
                validate: (value) => validate(value.trim())
            }]).then(function ({ value }) {
            chooseAppTemplate(value.trim());
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
        (0, copyFolderSync_1.copyFolderSync)(path_1.default.join(__dirname, "../../../demoTemplates", value), appTemplatlocation);
        fs_1.default.writeFileSync(path_1.default.join(appTemplatlocation, "package.json"), JSON.stringify((0, demo_package_1.getDemoPackageObject)(appName), null, 4), "utf8");
        fs_1.default.writeFileSync(path_1.default.join(appTemplatlocation, "tsconfig.json"), JSON.stringify((0, demo_tsconfig_1.getDemoTsConfigObject)(), null, 4), "utf8");
        (0, child_process_1.spawn)('npm', ["install"], {
            cwd: appTemplatlocation,
            shell: true,
            stdio: 'inherit'
        }).on("close", () => {
            (0, loger_1.clareLog)({
                [`Project "${appName}" Created`]: "green",
                [`\nLocation: ` + appTemplatlocation]: "white"
            });
        });
    });
};
