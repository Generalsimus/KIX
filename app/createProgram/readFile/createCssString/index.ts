import path from "path";
import { filePathToUrl } from "../../../../utils/filePathToUrl";
import { App } from "../../..";
import { parseCssFile } from "./parseCssFile";
import { btoa } from "buffer";

export const createCssString = (
  fileName: string,
  fileContent: string
): string => {
  const { css, sourceMap } = parseCssFile(fileName, fileContent);
  const styleString = String(css);
  if (App.devMode) {
    // let sourceMappingURL =
    //   filePathToUrl(fileName) + ".map";

    const sourceMappingURL = `data:application/json;charset=utf8;base64,${Buffer.from(JSON.stringify(sourceMap)).toString("base64")}`
    return `import kix from "kix";
      const s = kix(document.head,{style:""});
      export default kix(s,${"`" + String(styleString) + "`"});
      kix(s,"\\n/*# sourceMappingURL=${sourceMappingURL} */");`;
  } else {
    return `import kix from "kix";
    export default kix(kix.style,${styleString});
    `;
  }
};
