import { createProgramHost } from "../..";
import { App } from "../../..";
import { parseCssFile } from "./parseCssFile";

export const createCssString = (
  fileName: string,
  fileContent: string,
  host: createProgramHost,
): string => {
  const { css, sourceMap } = parseCssFile(fileName, fileContent, host);
  

  const styleToString = String(css).trim()
  if (App.devMode) {
    const sourceMappingURL = `data:application/json;charset=utf8;base64,${Buffer.from(JSON.stringify(sourceMap)).toString("base64")}`

    return `import kix from "kix";
      const s = kix(document.head, { style: "" });
      export default kix(s, \`${styleToString}\`);
      kix(s,"\\\\n/*# sourceMappingURL=${sourceMappingURL} */");`;
  } else {

    return `import kix, { styleCssDom } from "kix";
    export default kix(styleCssDom, \`${styleToString}"\`);
    `;
  }
};
