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
import { configModules, getOrSetModuleInfo, ModulesThree, watchModuleFileChange } from "./utils"
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
    createIdentifier
} = factory
const {
    CREATE_Export_File_Function,
    CREATE_Plus_Token_Nodes,
    CREATE_Const_Variable,
    CREATE_Property_Access_Expression,
    CREATE_Equals_Token_Nodes,
    CREATE_Object_Binding_Pattern,
    CREATE_CAll_Function,
    CREATE_Assign_Polyfil,
    CREATE_Property_Access_Equals_Token,
    CREATE_Object_WiTH_String_Keys
} = generateFactory
// defaultModulePaths


// const watcher = chokidar.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')
// let incremm = 0
export const visited_SourceFiles = new Map()
export const ModuleTransformersBefore = {
    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
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
        const moduleInfo = getOrSetModuleInfo(NODE.originalFileName, compilerOptions)

        CTX.ModuleColection = configModules(NODE, moduleInfo, compilerOptions)

        if (!moduleInfo.isNodeModule && !moduleInfo.fileWatcher) {
            watchModuleFileChange(NODE, moduleInfo, compilerOptions)
        }

        try {
            if (ts.isJsonSourceFile(NODE)) {

                NODE = ts.updateSourceFileNode(NODE, [createExpressionStatement(CREATE_Property_Access_Equals_Token(CREATE_Object_WiTH_String_Keys([
                    [createIdentifier("default"), ...NODE.statements]
                ]), [compilerOptions.__Import_Module_Name, getColumnName(moduleInfo.Module_INDEX)]))])

                NODE.scriptKind = ScriptKind.Unknown
            } else {
                console.log("🚀 --> file: Module.js --> line 63 --> NODE.originalFileName", [NODE.originalFileName]);
                NODE = ts.updateSourceFileNode(NODE, [
                    createExpressionStatement(
                        CREATE_Export_File_Function(
                            NODE.statements.flatMap((statementNode) => topLevelVisitor(statementNode, NODE, CTX)),
                            compilerOptions.__Import_Module_Name,
                            moduleInfo.Module_INDEX
                        )
                    )
                ]
                )
            }
            NODE.externalModuleIndicator = undefined
        } catch (error) {
            console.log(error)
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

