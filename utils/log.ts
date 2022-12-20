
import consola from "consola"


export const log = {
    log: consola.log.bind(consola),
    error: consola.error.bind(consola),
    warn: consola.warn.bind(consola),
    clear: consola.clear.bind(consola)
} 