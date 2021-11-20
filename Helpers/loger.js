import consola from "consola"
import { CustomError } from "./customError";



const savedLogs = [

]
const colors = {
    white: "\x1b[37m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m"
};


export const saveLog = (logObject) => {
    for (const Logstring in logObject) {
        savedLogs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`)
    }
    console.clear();
    console.log.apply(null, savedLogs)
}

export const log = (logObject) => {
    const logs = [...savedLogs]
    for (const Logstring in logObject) {
        logs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`)
    }
    console.clear();
    console.log.apply(null, logs)
}

export const clareLog = (logObject) => {
    const logs = []
    for (const Logstring in logObject) {
        logs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`)
    }
    console.clear();
    console.log.apply(null, logs)
}


//     DIAGNOSTIC.messageText,
//     undefined,
//     undefined,
// const ss = {
//     messageText,
//     errorText
// }

export const logError = (error) => {
    consola.error(new CustomError(error))
}

// consola.error(new CustomError(
//     DIAGNOSTIC.messageText,
//     undefined,
//     undefined,
//     `\nat (${PATH_relativ}:${line + 1}:${character + 1})` + "\n " +
//     HighLight(SPLITED).split('\n').map((v, index) => {

//         let leng = (String(Math.max(line - 1, line + 3)).length - String(line + index).length)
//         let left_join = Array.from(Array(leng), x => " ").join("")




//         return Chalk[index ? "grey" : "redBright"](left_join + ((line + 1) + index) + '|' + (index ? "  " : "> ")) + v
//     }).join('\n')
// ))