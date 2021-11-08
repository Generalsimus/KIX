import path from "path";
import sass from "sass"
import { App } from "../init/App"
import URL from "url"
import fs from "fs"
import { createSourceFile, ScriptTarget } from "typescript";
export default function createCssSourceFile(fileName, fileContent, languageVersion) {
    const { css, map } = parseCssFile(fileName, fileContent)
    console.log("🚀 --> file: createCssSourceFile.js --> line 9 --> createCssSourceFile --> css, map", parseCssFile(fileName, fileContent));
    let sourceFile = createSourceFile(
        fileName,
        'import kix from "kix"\n export default kix(kix.style, `' + css.toString() + '`)' + `
        console.log(kix)
        
        `,
        languageVersion,
        true
    )
    if (App.__Dev_Mode) {
        sourceFile = createSourceFile(
            fileName,
            `import kix from "kix";
            const style = KD_(document.head,{style:""});
            ` + 'export default kix(style, `' + css.toString() + '`);\n' + `
            KD_(style,"\\n/*# sourceMappingURL=${map.toString()} */`,
            languageVersion,
            true
        )
    } else {
        sourceFile = createSourceFile(
            fileName,
            'import kix from "kix"\n export default kix(kix.style, `' + css.toString() + '`)',
            languageVersion,
            true
        )
    }
    sourceFile.isCSSFile = true
    return sourceFile
}
export const parseCssFile = (fileName, fileContent) => {
    return sass.renderSync({
        file: fileName,
        data: resolveQuotesInFileContent(fileContent),
        outputStyle: 'compressed',
        importer: function (url, prev, done) {
            var PATH = path.resolve(path.dirname(fileName) + "/" + url)
            if (fs.existsSync(PATH)) {
              
                return { file: PATH, contents: fs.readFileSync(PATH, "utf8") };
            }
            return { file: url, contents: undefined };
        },
        functions: {
            'url($filename)': function (filename) {
                var url = RESOLVE_URL(filename.getValue().trim(), fileName)

                return new sass.types.String(`url("${url}")`)
            }
        },
        sourceMapContents:true,
        sourceMap: true,
        // sourceMapContents: App.__Dev_Mode,
        // sourceMap: App.__Dev_Mode,
    })

}



function RESOLVE_URL(url, fileName) {
    var TEST_LOCAL_PATH = /^(\.)+[.\s]?(\/)/,
        FIX_URL = (url) => path.relative(App.__RunDirName, path.dirname(fileName) + "/" + url).replace(/\\/g, "/");

    if (TEST_LOCAL_PATH.test(url)) {
        url = FIX_URL(url)

        if (!TEST_LOCAL_PATH.test(url)) {
            url = "/" + url
        }
        return url
    } else if (url.startsWith('/')) {
        return url
    }

    url = URL.resolve("/", url)

    if (url.startsWith('/')) {
        return "/" + FIX_URL(url)
    }

    return url
}

const resolveQuotesInFileContent = (fileContent) => {
    var STYLE = fileContent,
        reg = /(?![a-zA-Z]).(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
        exec_url,
        NEW_STYLE = "",
        START_INDEX = 0;
    while (exec_url = reg.exec(STYLE)) {
        NEW_STYLE += STYLE.slice(START_INDEX, exec_url.index + 1);
        START_INDEX = exec_url.index + exec_url[0].length;
        let url = exec_url[0].slice(5, -1)
        if (!/^[\"']+|[\"']+$/.test(url)) {
            url = `"${url}"`
        }
        NEW_STYLE += `url(${url})`

    }
    NEW_STYLE += STYLE.slice(START_INDEX)

    return NEW_STYLE
}