export const resolveQuotesInFileContent = (fileContent: string) => {
  let STYLE = fileContent,
    reg = /(\burl\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
    // /(?![a-zA-Z]).(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
    exec_url,
    NEW_STYLE = "",
    START_INDEX = 0;
  while ((exec_url = reg.exec(STYLE))) {
    NEW_STYLE += STYLE.slice(START_INDEX, exec_url.index + 1);
    START_INDEX = exec_url.index + exec_url[0].length;
    let url = exec_url[0].slice(5, -1);
    if (!/^[\"']+|[\"']+$/.test(url)) {
      url = `"${url}"`;
    }
    NEW_STYLE += `url(${url})`;
  }
  NEW_STYLE += STYLE.slice(START_INDEX);

  return NEW_STYLE;
};
