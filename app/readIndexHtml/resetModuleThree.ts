import { App } from "../index";
// import { createModulgetOutputFileNameeInfo } from "../../utils/createModuleInfo";

export const resetModuleThree = (newModules: Set<string>) => {
  App.moduleThree.clear();

  // newModules.forEach((modulePath: string) => {
  //   App.moduleThree.set(modulePath, createModuleInfo(modulePath));
  // });
};
