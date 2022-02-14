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
