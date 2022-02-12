import ts from "typescript";
import { rootWriter } from "..";

export function getMapUrl(rootWriterHost: rootWriter) {

    if (rootWriterHost.isNodeModules || !rootWriterHost.host.options.sourceMap) return "";

    return `\n//# sourceMappingURL=${rootWriterHost.requestPath}.map`
}