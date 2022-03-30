import path from "node:path/win32";
import { decode, encode } from "sourcemap-codec";
import { resolveUrl } from "./resolveUrl";

const regex = /(\burl\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g
export const remapCssURL = (css: string, sourceMap: { sources: string[], sourcesContent: string[], mappings: string }, fileName: string) => {
    const decodedMappings = decode(sourceMap.mappings)

    // console.log("🚀 --> file: remapCssURL.ts --> line 18 --> sourceFileName --> sourceMap", sourceMap.file, sourceMap.sources);
    const splitCss = css.split(/\n/)
    for (const generatedLineIndex in splitCss) {
        const generatedLineString = splitCss[generatedLineIndex];
        const lineDecodedMappings = decodedMappings[generatedLineIndex];

        splitCss[generatedLineIndex] = generatedLineString.replace(regex, function (match, group) {
            const columnIndex = arguments[7];
            let sourceFileName = lineDecodedMappings.reduce((acc: undefined | string, curr) => {
                if (curr[0] === columnIndex) {
                    return path.join(path.dirname(fileName), sourceMap.sources[(curr as any)[1]])
                }
                return acc
            }, undefined) || fileName
            const url = match.slice(4, -1).trim().replace(/(^"|"$)|(^'|'$)/g, "").trim();
            const replacedURL = `url(${resolveUrl(url, sourceFileName)})`;

            const changeCount = replacedURL.length - match.length;

            for (const mapping of lineDecodedMappings) {
                if (mapping[0] >= columnIndex) {
                    mapping[0] = mapping[0] + changeCount;

                }
            }

            return replacedURL
        });
    }

    return {
        css: splitCss.join("\n"),
        sourceMap: {
            ...sourceMap,
            mappings: encode(decodedMappings)
        }
    }

}