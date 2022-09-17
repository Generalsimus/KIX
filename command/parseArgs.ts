import yargs, { ArgumentsCamelCase } from "yargs"
import packageJson from "../package.json"


export const parseArgs = (): Promise<ArgumentsCamelCase> => {

    const argv = yargs(process.argv.slice(2))
        .scriptName(packageJson.name)
        .usage('For more details please visit ' + packageJson.homepage)
        .command('new', `Creates a new workspace and an initial Kix application.`)
        .command('start', 'Builds and run your app, rebuilding on file changes.')
        // .command('build', `Compiles an Kix app into an output directory default named ${outDir} at the given output path.`)
        .options({
            outDir: {
                // default: outDir,
                describe: 'Specify an output folder for all emitted files.',
                type: "string",
            },
            port: {
                // default: App.port,
                describe: 'choose your port',
                type: "number",
            }
        })
        .help('help').argv;


    if (argv instanceof Promise) {
        return argv
    } else {
        return new Promise<ArgumentsCamelCase>((resolve) => resolve(argv))
    }
}