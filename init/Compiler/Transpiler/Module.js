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
        const moduleInfo = compilerOptions.__moduleThree.get(NODE.originalFileName)
        // console.log(compilerOptions.__moduleThree, NODE.originalFileName, compilerOptions.__moduleThree.keys())
        // console.log( NODE.originalFileName, compilerOptions.__moduleThree.keys())
        // console.log("🚀 --> file: Module.js --> line 70 --> compilerOptions.__moduleThree", compilerOptions.__moduleThree)

        CTX.ModuleColection = moduleInfo.moduleColection;



        const isNodeModuleOrNodeCompiler = moduleInfo.isNodeModule && !compilerOptions.__isNodeModuleBuilding;
        // console.log("🚀 --> file: Module.js --> line 70 --> NODE.originalFileName", NODE.originalFileName, !!CTX.Module_GET_POLYFIL, compilerOptions.__visitedSourceFilesMap.has(NODE.originalFileName))
        if (isNodeModuleOrNodeCompiler || (moduleInfo.isAsyncModule)) {
            NODE = ts.updateSourceFileNode(NODE, [])
            NODE.externalModuleIndicator = undefined


            generateFactory.CREATE_Async_Module_SourceFile_IF_NEEDED(NODE, moduleInfo, compilerOptions)

            return NODE
        }



        const visitedSourceFile = compilerOptions.__visitedSourceFilesMap.get(NODE.originalFileName)

        if (visitedSourceFile) {
            CTX.Module_GET_POLYFIL = (CTX.Module_GET_POLYFIL || visitedSourceFile.Module_GET_POLYFIL)
            return visitedSourceFile
        }




        // if (!moduleInfo.isAsyncModule) {
        // if (!(moduleInfo.isAsyncModule && !moduleInfo.isEs6Module) || (moduleInfo.isAsyncModule && moduleInfo.isEs6Module)) {


        try {

            if (ts.isJsonSourceFile(NODE)) {
                NODE = generateFactory.CREATE_JSON_SourceFile(NODE, moduleInfo, compilerOptions)
            } else {
                NODE = generateFactory.CREATE_IMPORT_JS_SourceFile(NODE, CTX, moduleInfo, compilerOptions)
            }

        } catch (error) {
            console.log(error)
        }
        // }

        generateFactory.CREATE_Async_Module_SourceFile_IF_NEEDED(NODE, moduleInfo, compilerOptions)




        watchModuleFileChange(NODE, moduleInfo, compilerOptions)



        NODE.externalModuleIndicator = undefined;




        generateFactory.CREATE_SourceFile_Polyfill_IF_NEEDED(NODE, CTX, compilerOptions)



        NODE = visitEachChild(NODE, visitor, CTX)

        compilerOptions.__visitedSourceFilesMap.set(NODE.originalFileName, NODE)


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

