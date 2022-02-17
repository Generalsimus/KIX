import { App } from "../..";


export const getRunCodeEmitFilePathIndexes = (pathsOrIndexes: (string | number)[]): string => {
    const indexes: string[] = [];
    for (const pathOrIndex of pathsOrIndexes) {
        if (typeof pathOrIndex === "number") {
            indexes.push(`${App.uniqAccessKey}[${pathOrIndex}];`);
        } else {
            const moduleInfo = App.moduleThree.get(pathOrIndex)
            if (!moduleInfo) throw new Error(`Module Index ${pathOrIndex} not found`)

            indexes.push(`${App.uniqAccessKey}[${moduleInfo.moduleIndex}];`)

        }
    }
    
    return indexes.join("\n")
}