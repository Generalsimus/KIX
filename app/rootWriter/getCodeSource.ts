import { rootWriter } from ".";
import { SourceMapMappings } from "sourcemap-codec";


export function getCodeSource(this: rootWriter, fileName: string) {

    let codeSource = this.codeByFileName[fileName]
    if (!codeSource) {
        codeSource = this.codeByFileName[fileName] = {
            code: "",
            decodedMappings: [] as SourceMapMappings,
            sourceMapNames: [] as string[],
        }
    }
    return codeSource
    // || (this.codeByFileName[fileName] = ({} as any))
}