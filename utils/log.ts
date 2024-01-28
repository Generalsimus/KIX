
// import consola from "consola"
import { createConsola } from "consola";

const consola = createConsola()
export const log = consola
// {
//     log: consola.log.bind(consola) as any,
//     error: consola.error.bind(consola),
//     warn: consola.warn.bind(consola),
//     clear: console.clear.bind(console)
// }  as const