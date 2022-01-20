
const exMsTime = new Date().getTime();
export const getOutputFileName = (fileName: string) => fileName.replace(/\.(tsx|ts|jsx)?$/, exMsTime + ".js")