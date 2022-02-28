import path from "path";
import { App } from "../../../app";
import { createProgramHost } from "../../../app/createProgram";
import { filePathToUrl } from "../../../utils/filePathToUrl";
import { normalizeSlashes } from "../../../utils/normalizeSlashes";
import { cachedErrType } from "../action-types";

export const parseErrorMessage = (host: createProgramHost, errorData: cachedErrType) => {
    const fileName = normalizeSlashes(path.resolve(errorData.filename));
    const requestPath = normalizeSlashes(path.resolve(errorData.filename));
    const fileText = host.sourceFileCache.get(fileName)?.getText();
    if (!fileText) return;

    return ""
}