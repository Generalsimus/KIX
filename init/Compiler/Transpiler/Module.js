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
import { FilesThree, getColumnName } from "../../../helpers/utils"
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

        

        const compilerOptions = CTX.getCompilerOptions()
        


        const moduleInfo = getOrSetModuleInfo(NODE.originalFileName, compilerOptions)

        CTX.ModuleColection = configModules(NODE, moduleInfo, compilerOptions)

        if (!moduleInfo.isNodeModule && !moduleInfo.fileWatcher && App.__Dev_Mode) {
            watchModuleFileChange(NODE, moduleInfo, compilerOptions)
        }

        try {

            if (ts.isJsonSourceFile(NODE)) {
                
                NODE = ts.updateSourceFileNode(NODE, [
                    createExpressionStatement(
                        generateFactory.CREATE_Export_File_Function(
                            NODE.statements.map((node) => {
                                return factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
                                    generateFactory.CREATE_Property_Access_Expression(["exports", "default"]),
                                    node.expression
                                ]))
                            }),
                            compilerOptions.__Import_Module_Name,
                            moduleInfo.Module_INDEX,
                            compilerOptions.rootNames.includes(NODE.originalFileName)
                        )
                    )
                ])

                // ეს იმიტომ json ის ტრანსპილირება რო არ მოხდეს amd ში
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
        
        visited_SourceFiles.set(NODE.originalFileName, NODE)
        
        
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

