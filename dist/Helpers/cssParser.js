"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCssFile = void 0;
const path_1 = __importDefault(require("path"));
const sass_1 = __importDefault(require("sass"));
const App_1 = require("../init/App");
const url_1 = __importDefault(require("url"));
const parseCssFile = (fileName, fileContent) => {
    const retsponse = sass_1.default.renderSync({
        file: fileName,
        data: resolveQuotesInFileContent(fileContent),
        outputStyle: 'compressed',
        importer: function (url, prev, done) {
            var PATH = path_1.default.resolve(path_1.default.dirname(fileName) + "/" + url);
            if (fs.existsSync(PATH)) {
                // @ts-ignore
                return { file: PATH, contents: fs.readFileSync(PATH, "utf8") };
            }
            return { file: url, contents: undefined };
        },
        functions: {
            'url($filename)': function (filename) {
                var url = RESOLVE_URL(filename.getValue().trim(), fileName);
                return new sass_1.default.types.String(`url("${url}")`);
            }
        },
    });
};
exports.parseCssFile = parseCssFile;
function RESOLVE_URL(url, fileName) {
    var TEST_LOCAL_PATH = /^(\.)+[.\s]?(\/)/, FIX_URL = (url) => path_1.default.relative(App_1.App.__RunDirName, path_1.default.dirname(fileName) + "/" + url).replace(/\\/g, "/");
    if (TEST_LOCAL_PATH.test(url)) {
        url = FIX_URL(url);
        if (!TEST_LOCAL_PATH.test(url)) {
            url = "/" + url;
        }
        return url;
    }
    else if (url.startsWith('/')) {
        return url;
    }
    url = url_1.default.resolve("/", url);
    if (url.startsWith('/')) {
        return "/" + FIX_URL(url);
    }
    return url;
}
const resolveQuotesInFileContent = (fileContent) => {
    var STYLE = fileContent, reg = /(?![a-zA-Z]).(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g, exec_url, NEW_STYLE = "", START_INDEX = 0;
    while (exec_url = reg.exec(STYLE)) {
        NEW_STYLE += STYLE.slice(START_INDEX, exec_url.index + 1);
        START_INDEX = exec_url.index + exec_url[0].length;
        let url = exec_url[0].slice(5, -1);
        if (!/^[\"']+|[\"']+$/.test(url)) {
            url = `"${url}"`;
        }
        NEW_STYLE += `url(${url})`;
    }
    NEW_STYLE += STYLE.slice(START_INDEX);
    return NEW_STYLE;
};
