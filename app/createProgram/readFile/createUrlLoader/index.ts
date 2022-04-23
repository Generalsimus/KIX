import fs from "fs";
import { createProgramHost } from "../..";
import { fileNameToUrlPath } from "../../../../utils/fileNameToUrlPath";

export const createUrlLoader = (
    fileName: string
): string | undefined=> {
    const exist = fs.existsSync(fileName);
    return exist ? `export default "${fileNameToUrlPath(fileName)}";` : undefined;
};
