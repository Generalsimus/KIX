import { exec } from "child_process"

export const getExecResToString = (command: string) => {
    const { stdout, stderr } = exec(command)
    // console.log("🚀 --> file: getPackageOptions.ts --> line 71 --> getExecResToString --> stderr", stderr);
    return new Promise<string>((resolve, reject) => {
        if (stdout) {
            stdout.on('data', (res: any) => {
                resolve((res + "").trim());
            });
            stdout.on("error", reject)
        } else {
            reject();
        }

    })
}