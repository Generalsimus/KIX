import { SourceMapMappings } from "sourcemap-codec";
import { rootWriter } from ".";
import { encode } from 'sourcemap-codec';
import { filePathToUrl } from "../../utils/filePathToUrl";
import { getNewLineCount } from "./utils/getNewLineCount";
interface SourceMapObject {
    version: number;
    sources: string[];
    names: string[];
    sourcesContent: string[];
    file: string;
    mappings: string;
}
export function createMapCode(this: rootWriter) {
    const sourcemap: SourceMapObject = {
        "version": 3,
        "sources": [],
        "names": [],
        "sourcesContent": [],
        "file": this.requestPath,
        "mappings": ""
    }

    let remapDecodedMappings: SourceMapMappings = new Array(getNewLineCount(this.injectCode)).fill([])

    for (const fileName in this.codeByFileName) {

        const sourcefile = this.host.sourceFileCache.get(fileName)


        const { sourceMapNames, decodedMappings, isMappingsSupported } = this.codeByFileName[fileName];
        if (!sourcefile || !isMappingsSupported) {
            remapDecodedMappings = [...remapDecodedMappings, ...decodedMappings];
            continue;
        }
        const fileIndex = sourcemap.sources.length;
        sourcemap.sources[fileIndex] = filePathToUrl(fileName);
        sourcemap.sourcesContent[fileIndex] = sourcefile.text;



        remapMappings(fileIndex, decodedMappings);

        remapDecodedMappings = [...remapDecodedMappings, ...decodedMappings];

        sourcemap.names = [...sourcemap.names, ...sourceMapNames]



    }


    sourcemap.mappings = encode(remapDecodedMappings);

    this.responseMAPCode = JSON.stringify(sourcemap);
}

const remapMappings = (fileIndex: number, decodedMappings: SourceMapMappings) => {
    for (const mapping of decodedMappings) {
        for (const decodedVLQ of mapping) {
            decodedVLQ[1] = fileIndex

        }
    }
}