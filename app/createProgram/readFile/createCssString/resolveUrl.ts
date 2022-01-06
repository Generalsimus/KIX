import { App } from "../../..";
import path from "path";
import urlPackage from "url";

export const resolveUrl = (url: string, fileName: string) => {
  var TEST_LOCAL_PATH = /^(\.)+[.\s]?(\/)/,
    fixUrl = (url: string) =>
      path
        .relative(App.runDirName, path.dirname(fileName) + "/" + url)
        .replace(/\\/g, "/");

  if (TEST_LOCAL_PATH.test(url)) {
    url = fixUrl(url);

    if (!TEST_LOCAL_PATH.test(url)) {
      url = "/" + url;
    }
    return url;
  } else if (url.startsWith("/")) {
    return url;
  }

  url = urlPackage.resolve("/", url);

  if (url.startsWith("/")) {
    return "/" + fixUrl(url);
  }

  return url;
};

// const resolveQuotesInFileContent = (fileContent) => {
//     var STYLE = fileContent,
//         reg = /(?![a-zA-Z]).(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
//         exec_url,
//         NEW_STYLE = "",
//         START_INDEX = 0;
//     while (exec_url = reg.exec(STYLE)) {
//         NEW_STYLE += STYLE.slice(START_INDEX, exec_url.index + 1);
//         START_INDEX = exec_url.index + exec_url[0].length;
//         let url = exec_url[0].slice(5, -1)
//         if (!/^[\"']+|[\"']+$/.test(url)) {
//             url = `"${url}"`
//         }
//         NEW_STYLE += `url(${url})`

//     }
//     NEW_STYLE += STYLE.slice(START_INDEX)

//     return NEW_STYLE
// };
