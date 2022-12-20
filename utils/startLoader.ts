
import color from "ansi-colors"

export const startLoader = (log = "") => {
    let x = 0;
    const P = ["\\", "|", "/", "-"];
    const logger = () => {
        process.stdout.write("\r" + color.cyan(P[x++]) + ` ` + log);
        x &= 3;
    }
    logger()
    const twirlTimer = setInterval(logger, 150);

    return () => {
        process.stdout.write("\r");
        clearInterval(twirlTimer)
    }
}