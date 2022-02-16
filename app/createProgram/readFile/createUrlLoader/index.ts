import { createProgramHost } from "../..";
import { fileNameToUrlPath } from "../../../../utils/fileNameToUrlPath";

export const createUrlLoader = (
    fileName: string
): string => {
    return `export default "${fileNameToUrlPath(fileName)}";`;
};
