import { toRgb } from "colby";

export const startLoader = (log = "") => {
    const cyanColor = toRgb(0, 255, 255)
    let x = 0;
    const P = ["\\", "|", "/", "-"];
    const logger = () => {
        process.stdout.write("\r" + cyanColor(P[x++]) + ` ` + log);
        x &= 3;
    }
    logger()
    const twirlTimer = setInterval(logger, 150);

    return () => {
        process.stdout.write("\r");
        clearInterval(twirlTimer)
    }
}