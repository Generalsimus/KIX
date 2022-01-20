import path from "path";
import { filePathToUrl } from "../../../../utils/filePathToUrl";
import { App } from "../../..";
import { parseCssFile } from "./parseCssFile";

export const createCssString = (
  fileName: string,
  fileContent: string
): string => {
  const result = parseCssFile(fileName, fileContent);
  const styleString = String(result);
  if (App.devMode) {
    let sourceMappingURL =
      filePathToUrl(fileName) + ".map";
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
