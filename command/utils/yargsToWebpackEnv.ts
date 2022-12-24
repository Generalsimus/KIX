import yargs from "yargs"
const ignoreCases = ["_", "$0"]
export const yargsToWebpackEnv = (runCommand = "", argv: yargs.ArgumentsCamelCase<{}>) => {
    let command = [runCommand, ...argv._, " -- "].join(" ").trim().replace(/\s+/gm, " ")
    for (const commandName in argv) {
        if (!ignoreCases.includes(commandName)) {
            command += ` --env ${commandName}=${argv[commandName]}`
        }
    }
    return command
}