#!/usr/bin/env node
import { App } from "./app";
import { Component } from "./main"; 
// TODO: ბილდზე კოდის კონტროლერების ფაილები ამოიღე
// TODO: ბილდზე ვაჩერის ლოგი არ უნდა ილოგებოდეს
// TODO: css ის მოდულების არსებობა გადაამოწმე
// TODO: ბილდი დაფიქსე მგონი ურევს
// TODO: გადაამოწმე კარგად css ის remaper ი 
// TODO: პორტ ჩექერი გადაამოწმე როგორ მუშაობს მგონი სხვა პორზე ვერ ხსნის
// TODO: getSourcefile შიდაამატე მოდულების არ მოძებნი ერორი და რესოლვზე ყოველთვის ობიექტი დააბრუნებინე რო getsourcefileში შემოვიდესხოლმე
// TODO: KIX კომანდით ბილდი გაითვალისწინე kix წინ დაწერილი ბრძანებები ავტომატურად გადააბი ფექიჯის გამშვების ბრძანებას
App.start()
// type JSXElementConstructor<P> = (props: P) => any | typeof Component<P>
// type ComponentType = typeof ;
// type GetClassParameterForAlphaBeta<T extends Alpha<any> | Beta<any>> =
//     T extends Alpha<infer R>
//     ? R : T extends Beta<infer R>
//     ? R : unknown; 

// import path from "path";
// import ts from "typescript";

// const fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_\. ]+/g;
// const toLowerCase = (fileName: string) => fileName.toLowerCase();

// const createGetCanonicalFileName = (system: ts.System) => {
//   return system.useCaseSensitiveFileNames
//     ? (fileName: string): string => fileName
//     : (fileName: string): string => {
//         return fileNameLowerCaseRegExp.test(fileName)
//           ? fileName.replace(fileNameLowerCaseRegExp, toLowerCase)
//           : fileName;
//       };
// };

// const configPath = ts.findConfigFile(
//   /*searchPath*/ "..//",
//   ts.sys.fileExists,
//   "tsconfig.json"
// );
// if (!configPath) {
//   throw new Error("Could not find a valid 'tsconfig.json'.");
// }

// var currentDirectory = path.resolve("./");
// console.log(
//   "🚀 --> file: index.ts --> line 29 --> currentDirectory",
//   currentDirectory
// );
// const system = ts.sys;
// const formatDiagnosticsHost = {
//   getCurrentDirectory: () => currentDirectory,
//   getNewLine() {
//     return system.newLine;
//   },
//   getCanonicalFileName: createGetCanonicalFileName(system),
// };
// const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
//   ts.sys.write(
//     ts.formatDiagnosticsWithColorAndContext(
//       [diagnostic],
//       formatDiagnosticsHost
//     ) + host.getNewLine()
//   );
// };

// // const createProgram = ;
// const host = ts.createWatchCompilerHost(
//   configPath,
//   {
//     rootNames: ["./zzz.ts"],
//     noEmit: true,
//   },
//   ts.sys,
//   ts.createSemanticDiagnosticsBuilderProgram,
//   reportDiagnostic
// );

// const origCreateProgram = host.createProgram;
// Object.assign(host, {
//   createProgram(
//     rootNames: readonly string[] | undefined,
//     options: ts.CompilerOptions | undefined,
//     host: ts.CompilerHost | undefined,
//     oldProgram: ts.SemanticDiagnosticsBuilderProgram | undefined
//   ) {
//     const program = origCreateProgram(rootNames, options, host, oldProgram);
//     // console.log("🚀 --> file: index.ts --> line 69 --> program", program);
//     // setTimeout(() => {
//     //   program.close();
//     // }, 1000);
//     return program;
//   },
// });

// const watcher = ts.createWatchProgram(host);
// setTimeout(() => {
//   watcher.close();
// }, 5000);

// console.log(
//   "🚀 --> file: index.ts --> line 73 --> ts.createWatchProgram(host);",
//   watcher
// );
