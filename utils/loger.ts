

const savedLogs: string[] = [];
const colors = {
    white: "\x1b[37m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m"
};

type LogObjectType = Record<string, keyof typeof colors>

export const saveLog = (logObject: LogObjectType) => {
    for (const logString in logObject) {
        savedLogs.push(`${colors[logObject[logString]] + logString}\x1b[0m`)
    }
    // console.clear();
    console.log.apply(null, savedLogs)
}

export const log = (logObject: LogObjectType) => {
    const logs = [...savedLogs]
    for (const logString in logObject) {
        logs.push(`${colors[logObject[logString]] + logString}\x1b[0m`)
    }
    // console.clear();
    console.log.apply(null, logs)
}

export const clareLog = (logObject: LogObjectType) => {
    const logs = []
    for (const logString in logObject) {
        logs.push(`${colors[logObject[logString]] + logString}\x1b[0m`)
    }
    // console.clear();
    console.log.apply(null, logs)
}




// export const logError = (error) => {
//     consola.error(new CustomError(error))
// }