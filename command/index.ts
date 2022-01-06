import ts from "typescript";
import path from "path";
import fs from "fs";
import yargs from "yargs"
import {
    hideBin
} from "yargs/helpers"
import { App } from "../app";
import { readIndexHtml } from "../app/readIndexHtml";
import { readTsConfigFile } from "../utils/readTsConfigFile";
import { parseArgs } from "./parseArgs";
import prompts from "prompts"
import { runCommands } from "./runCommands";

export const readCommandsAndRun = async () => {
    parseArgs().then((argv) => {
        Object.assign(App, {
            port: argv.port as number,
            outDir: argv["outDir"],
            devMode: argv._.includes("start"),
            parsedArgs: argv,
        })
        runCommands()
    })
}