import ts, {
    factory,
    visitEachChild,
    getDirectoryPath,
    isNamespaceExport,
    idText,
    createIdentifier,
    normalizeSlashes,
    SyntaxKind,
    getLocalNameForExternalImport,
    collectExternalModuleInfo,
    createIdentifier,
    SignatureKind,
    TransformFlags,
    ScriptKind
} from "typescript"
import { generateFactory } from "./createFactoryCode"
import resolve from 'resolve'
import path from "path/posix"
import chokidar from "chokidar"
import { FilesThree, getColumnName } from "../../../Helpers/utils"
import { configModules, geModuleLocationMeta, getOrSetModuleInfo, ModulesThree, watchModuleFileChange } from "./utils"
import { topLevelVisitor } from "./amdBodyVisitor"
import { App } from "../../App"

// console.log("🚀 ---> file: Module.js ---> line 16 ---> TransformFlags", TransformFlags)
const { ContainsDynamicImport } = TransformFlags
const {
    createStringLiteral,
    createCallExpression,
    createUniqueName,
    createExpressionStatement,
    createParenthesizedExpression,
    createReturnStatement,
    createIdentifier,
} = factory

// defaultModulePaths


// const watcher = chokidar.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')
// let incremm = 0
export const visited_SourceFiles = new Map()
export const ModuleTransformersBefore = {
    [SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 49 --> NODE", NODE)/

    },
    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 61 --> NODE", Object.keys(NODE));

        // return NODE
        // console.log("🚀 --> file: Module.js --> line 58 --> CTX", CTX);
        // if (NODE.before_visited) return NODE
        const visited_NODE = visited_SourceFiles.get(NODE.originalFileName)
        // const visited_NODE = FilesThree.get(NODE.path)

        if (visited_NODE) {
            return visited_NODE
        }

        // console.log("🚀 --> file: Module.js --> line 65 --> NODE.originalFileName", visited_SourceFiles.keys(), NODE.originalFileName, ++incremm);
        // console.log("🚀 --> file: Module.js --> line 60 --> NODE.before_visited", NODE.before_visited);

        const compilerOptions = CTX.getCompilerOptions()
        // console.log("🚀 --> file: Module.js --> line 75 --> compilerOptions", compilerOptions);
        // console.log("🚀 --> file: Module.js --> line 75 --> CTX", CTX);
        // getEmitHost:
        // getEmitResolver
        // getEmitHelperFactory
        // console.log("🚀 --> file: Module.js --> line 75 --> CTX", CTX.getEmitHelperFactory());
        // console.log("🚀 --> file: Module.js --> line 75 --> CTX", CTX.getEmitHost());
        // console.log("🚀 --> file: Module.js --> line 75 --> CTX", CTX.getEmitResolver());
        const moduleInfo = getOrSetModuleInfo(NODE.originalFileName, compilerOptions)

        CTX.ModuleColection = configModules(NODE, moduleInfo, compilerOptions)

        if (!moduleInfo.isNodeModule && !moduleInfo.fileWatcher && App.__Dev_Mode) {
            watchModuleFileChange(NODE, moduleInfo, compilerOptions)
        }

        try {

            if (ts.isJsonSourceFile(NODE)) {

                NODE = ts.updateSourceFileNode(NODE, [createExpressionStatement(generateFactory.CREATE_Property_Access_Equals_Token(generateFactory.CREATE_Object_WiTH_String_Keys([
                    [createIdentifier("default"), ...NODE.statements]
                ]), [compilerOptions.__Import_Module_Name, getColumnName(moduleInfo.Module_INDEX)]))])

                NODE.scriptKind = ScriptKind.Unknown
            } else {
                NODE = ts.updateSourceFileNode(NODE, [
                    createExpressionStatement(
                        generateFactory.CREATE_Export_File_Function(
                            NODE.statements.flatMap((statementNode) => topLevelVisitor(statementNode, NODE, CTX)),
                            compilerOptions.__Import_Module_Name,
                            moduleInfo.Module_INDEX,
                            compilerOptions.rootNames.includes(NODE.originalFileName)
                        )
                    )
                ])

                if (NODE.isCSSFile) {
                    NODE.fileName = NODE.fileName + ".json"
                }
            }
            NODE.externalModuleIndicator = undefined
        } catch (error) {
            console.log(error)
        }

        if (!CTX.Module_GET_POLYFIL) {
            NODE.statements.splice(0, 0, (CTX.Module_GET_POLYFIL = generateFactory.CREATE_Module_GET_POLYFIL(compilerOptions.__Import_Module_Name)))
        }

        NODE = visitEachChild(NODE, visitor, CTX)
        // NODE.before_visited = true; 
        visited_SourceFiles.set(NODE.originalFileName, NODE)
        // setFileinThree.set(NODE.originalFileName, NODE)
        // App.__Host.setFileinThree(NODE.originalFileName.toLowerCase(), NODE)
        // .set(NODE.originalFileName)
        // FilesThree.set(NODE.path, NODE)
        return NODE
    }
}


export const ModuleTransformersAfter = {
    // [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
    //     if (NODE.After_visited) return NODE

    //     NODE.After_visited = true;
    //     return NODE
    // }
}

