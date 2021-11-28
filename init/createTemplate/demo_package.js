import { parseJsonFile } from "../../Helpers/utils"
import ts from "typescript"
import { App } from "../App"
import fs from "fs"


export const getDemoPackageObject = (appName) => {
    const pckageJson = parseJsonFile(ts.findConfigFile(__dirname, fs.existsSync, "./package.json"))


    return {
        "name": appName,
        "version": "1.0.0",
        "private": true,
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "dev": "kix start",
            "start": "kix start"
        },
        "repository": {
            "type": "git",
            "url": "git+https://github.com/Generalsimus/KIX.git"
        },
        "bugs": {
            "url": "https://github.com/Generalsimus/KIX/issues"
        },
        "homepage": "https://github.com/Generalsimus/KIX#readme",
        "devDependencies": {
            "kix": "^" + pckageJson.version
        },
        "dependencies": {}
    }
}