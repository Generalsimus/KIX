import path from "path";
import ts from "typescript";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getDefaultLibFileName = (defaultLibLocation: string, options: ts.CompilerOptions) => {

    return normalizeSlashes(path.join(defaultLibLocation, ts.getDefaultLibFileName(options)))
}