import ts from "typescript";

const fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_\. ]+/g,
    toLowerCase = (fileName: string) => fileName.toLowerCase();
export const getCanonicalFileName = (ts.sys.useCaseSensitiveFileNames
    ? (fileName: string): string => fileName
    : (fileName: string): string => {
        return fileNameLowerCaseRegExp.test(fileName)
            ? fileName.replace(fileNameLowerCaseRegExp, toLowerCase)
            : fileName;
    })


