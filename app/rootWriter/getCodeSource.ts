import { rootWriter } from ".";
import { SourceMapMappings } from "sourcemap-codec";
import { getNewLineCount } from "./utils/getNewLineCount";


export function getCodeSource(this: rootWriter, fileName: string) {


    let decodedMappings: SourceMapMappings | undefined
    let decodedMappingsNotFill: SourceMapMappings | undefined
    return this.codeByFileName[fileName] ||= {
        code: "",
        isMappingsSupported: /(\.((j|t)(sx|s)))$/i.test(fileName),
        get decodedMappings() {
            if (decodedMappings) {
                return decodedMappings
            }
            if (decodedMappingsNotFill) {
                decodedMappingsNotFill.push(...(new Array(getNewLineCount(this.code) - decodedMappingsNotFill.length).fill([])));
                return decodedMappings = decodedMappingsNotFill
            }
            return decodedMappings = new Array(getNewLineCount(this.code)).fill([])
        },
        set decodedMappings(value: SourceMapMappings) {
            if (this.isMappingsSupported) {
                decodedMappings = undefined;
                decodedMappingsNotFill = value
            }

        },
        sourceMapNames: [],
    }

}