import ts, {
    factory,
    visitEachChild,
    SyntaxKind,
    createIdentifier,
    ScriptKind
} from "typescript"
import { generateFactory } from "./createFactoryCode"
import { watchModuleFileChange } from "./utils"
import { topLevelVisitor } from "./amdBodyVisitor"
import { App } from "../../App"
import { filePathToUrl } from "../../../helpers/utils"
import path from "path"

// console.log("🚀 ---> file: Module.js ---> line 16 ---> TransformFlags", TransformFlags)





export const visitedSourceFilesMap = new Map()
export const ModuleTransformersBefore = {
    [SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
        // console.log("🚀 --> file: Module.js --> line 49 --> NODE", NODE)/

    },
    [SyntaxKind.ImportKeyword]: (NODE, visitor, CTX) => {

        /*
        import(urlPath,()=>ssss[1])
        
        const IMPORT_POLYFIL = (urlPath,getModule:()=>ggggg[2]) => new Promise((resolve, reject) => {
getModule()?resolve(getModule()):kix(document.head, {
                    script: null,
                    src: urlPath,
                    e: {
                        load: () => resolve(getModule())
                    }
                })
        }) 
                
        */
        /*
        const ssss = (ur:string,getModule:()=>ggggg[2])=>{
 
        }
        */
        if (NODE.parent && NODE.parent.arguments?.["0"]?.text) {
            const moduleInfo = CTX.ModuleColection[NODE.parent.arguments["0"].text]
            const compilerOptions = CTX.getCompilerOptions()
            if (moduleInfo) {
                NODE.parent.arguments = [
                    ts.createStringLiteral(filePathToUrl(path.relative(App.__RunDirName, moduleInfo.modulePath)))
                ]
                return factory.createElementAccessExpression(
                    factory.createIdentifier(compilerOptions.__Import_Module_Name),
                    /* a === async */
                    factory.createStringLiteral(moduleInfo.moduleIndex + "a")
                )
            }
        }
        // return NODE;
        return factory.createIdentifier("import")
    },
    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // return NODE 

        const compilerOptions = CTX.getCompilerOptions()
        const moduleInfo = compilerOptions.moduleThree.get(NODE.originalFileName)
        CTX.ModuleColection = moduleInfo.moduleColection;




        if (moduleInfo.isNodeModule && !compilerOptions.__isNodeModuleBuilding) {
            NODE = ts.updateSourceFileNode(NODE, [])
            NODE.externalModuleIndicator = undefined
            return NODE
        }
        const visitedSourceFile = visitedSourceFilesMap.get(NODE.originalFileName)

        if (visitedSourceFile) {
            CTX.Module_GET_POLYFIL = (CTX.Module_GET_POLYFIL || visitedSourceFile.Module_GET_POLYFIL)
            return visitedSourceFile
        }
 
        if (moduleInfo.isAsyncModule) {
            NODE = generateFactory.CREATE_Async_Module_SourceFile(NODE, moduleInfo, compilerOptions);
        } else {

            try {

                if (ts.isJsonSourceFile(NODE)) {
                    NODE = ts.updateSourceFileNode(NODE, [
                        factory.createExpressionStatement(
                            generateFactory.CREATE_Export_File_Function(
                                NODE.statements.map((node) => {
                                    return factory.createExpressionStatement(generateFactory.CREATE_Equals_Token_Nodes([
                                        generateFactory.CREATE_Property_Access_Expression(["exports", "default"]),
                                        node.expression
                                    ]))
                                }),
                                compilerOptions.__Import_Module_Name,
                                moduleInfo.moduleIndex,
                            )
                        )
                    ])

                    // ეს იმიტომ json ის ტრანსპილირება რო არ მოხდეს amd ში
                    NODE.scriptKind = ScriptKind.Unknown
                } else {
                    NODE = ts.updateSourceFileNode(NODE, [
                        factory.createExpressionStatement(
                            generateFactory.CREATE_Export_File_Function(
                                NODE.statements.flatMap((statementNode) => topLevelVisitor(statementNode, NODE, CTX)),
                                compilerOptions.__Import_Module_Name,
                                moduleInfo.moduleIndex,
                            )
                        )
                    ])

                    if (NODE.isCSSFile) {
                        NODE.fileName = NODE.fileName + ".json"
                    }
                }

            } catch (error) {
                console.log(error)
            }
        }

        if (
            (!moduleInfo.fileWatcher && App.__Dev_Mode && !compilerOptions.__isNodeModuleBuilding) &&
            (!moduleInfo.isAsyncModule || (moduleInfo.isAsyncModule && !moduleInfo.isEs6Module))
        ) {
            watchModuleFileChange(NODE, moduleInfo, compilerOptions)
        }


        NODE.externalModuleIndicator = undefined;


        if (!CTX.Module_GET_POLYFIL) {
            NODE.statements.splice(0, 0,
                (CTX.Module_GET_POLYFIL =
                    (
                        NODE.Module_GET_POLYFIL =
                        generateFactory.CREATE_Module_GET_POLYFIL(compilerOptions.__Import_Module_Name)
                    )
                )
            )
        }


        NODE = visitEachChild(NODE, visitor, CTX)

        visitedSourceFilesMap.set(NODE.originalFileName, NODE)


        return NODE
    }
}


export const ModuleTransformersAfter = {
    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        // if (NODE.After_visited) return NODE

        // const compilerOptions = CTX.getCompilerOptions()



        // const moduleInfo = getOrSetModuleInfo(NODE.originalFileName, compilerOptions)
        // // console.log("🚀 --> file: Module.js --> line 76 --> moduleInfo", moduleInfo.moduleKind)
        // if (moduleInfo.moduleKind === "ImportKeyword") {
        //     return ts.updateSourceFileNode(NODE, []);
        // }
        // NODE.After_visited = true;
        return NODE
    }
}

