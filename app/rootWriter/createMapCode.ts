import { SourceMapMappings } from "sourcemap-codec";
import { rootWriter } from ".";
import { encode } from 'sourcemap-codec';
import { filePathToUrl } from "../../utils/filePathToUrl";
export function createMapCode(this: rootWriter) {
    const sourcemap = {
        "version": 3,
        "sources": [] as string[],
        "names": [] as string[],
        "sourcesContent": [] as string[],
        "file": this.requestPath,
        "mappings": ""
    }

    let remapDecodedMappings: SourceMapMappings = new Array(((this.injectCode.match(/\n/gm)?.length ?? 0) + 0)).fill([])
    // console.log("🚀 --> file: createMapCode.ts --> line 15 --> createMapCode --> remapDecodedMappings", remapDecodedMappings);
    // console.log("🚀 --> file: createMapCode.ts --> line 15 --> createMapCode --> this.injectCode", this.injectCode);
    // let lineIndex = 0;
    for (const fileName in this.codeByFileName) {



        const sourcefile = this.host.sourceFileCache.get(fileName)
        if (!sourcefile) continue;
        const fileIndex = sourcemap.sources.length;
        sourcemap.sources[fileIndex] = filePathToUrl(fileName);
        sourcemap.sourcesContent[fileIndex] = sourcefile.text;
        const { decodedMappings, sourceMapNames } = this.codeByFileName[fileName];


        remapMappings(fileIndex, decodedMappings);

        remapDecodedMappings = [...remapDecodedMappings, [], [], ...decodedMappings];

        sourcemap.names = [...sourcemap.names, ...sourceMapNames]


        // remapDecodedMappings.push(...new Array(lineIndex+=2).fill([]));
        // remapDecodedMappings.push(...new Array(++lineIndex).fill([]));
        sourcemap.mappings = encode(remapDecodedMappings)
        this.responseMAPCode = JSON.stringify(sourcemap);
    }
}

const remapMappings = (fileIndex: number, decodedMappings: any[]) => {
    for (const mapping of decodedMappings) {
        for (const decodedVLQ of mapping) {
            decodedVLQ[1] = fileIndex

        }
    }
}