import path from "path";

export const normalizeSlashes = (fileName: string) => fileName.split(path.sep).join("/")