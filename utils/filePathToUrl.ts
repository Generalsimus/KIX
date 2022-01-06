export const filePathToUrl = (filePath: string) => {
  return ("./" + filePath).replace(/(^[\.\.\/]+)|([\\]+)/g, "/");
  // return ("./" + filePath).replace(/(^[\.\.\/]+)|(\/+)/g, "\\")
};
