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
import { getColumnName } from "../../../Helpers/utils"
import { configModules, getOrSetModuleInfo, ModulesThree } from "./utils"
import { topLevelVisitor } from "./amdBodyVisitor"

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



const watcher = chokidar.watch([]);
// let STATEMENTS = []
// let stateNode = CREATE_Call_Function(STATEMENTS)
// let UNICNAME = ts.createUniqueName('AAA')

export const ModuleTransformersBefore = {
    // [SyntaxKind.ExportAssignment]: (Node) => {  
    // }, 
    // [SyntaxKind.ArrowFunction]: (NODE, visitor, CTX) => { 
    //     // return visitEachChild(NODE, visitor, CTX)
    // },
    [SyntaxKind.ImportDeclaration]: (NODE, visitor, CTX) => {
        // return visitEachChild(NODE, visitor, CTX)
    },
    [SyntaxKind.ExportKeyword]: (NODE, visitor, CTX) => {
        // delete NODE.parent 
        // console.log("🚀 --> file: Module.js --> line 65 --> NODE", NODE);

        // console.log("ExportKeyword",NODE)
        //     // return visitEachChild(NODE, visitor, CTX)
    },
    [SyntaxKind.ExportDeclaration]: (NODE, visitor, CTX) => {

        // delete NODE.parent 
        // console.log("ExportKeyword",NODE)
        //     // return visitEachChild(NODE, visitor, CTX)
    },

    // [SyntaxKind.ImportKeyword]: (NODE, visitor, CTX) => {
    //     //     console.log("🚀 ---> file: transpilers.js ---> line 31 ---> CTX",)
    //     if (NODE.parent.arguments) {
    //         NODE.parent.arguments[0] = CREATE_Plus_Token_Nodes([createStringLiteral(CTX.getCompilerOptions().__Url_Dir_Path), NODE.parent.arguments[0]])
    //     }
    //     return ts.createIdentifier("ASYNC_IMPORT_POLYFIL")
    // },
    // [SyntaxKind.RequireKeyword]: (NODE, visitor, CTX) => {
    //     return ts.createIdentifier("ssssssssssssss")
    // },
    [SyntaxKind.ExportAssignment]: (NODE, visitor, CTX) => {
        // delete NODE.parent
        // console.log("🚀 --> file: Module.js --> line 89 --> NODE.parent", NODE.parent); 
        // console.log("🚀 --> file: Module.js --> line 88 --> NODE", NODE); 

    },


    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        console.log("🚀 --> file: Module.js --> line 97 --> CTX", CTX.startLexicalEnvironment);
        if (NODE.before_visited) return NODE

        const compilerOptions = CTX.getCompilerOptions()
        const moduleInfo = getOrSetModuleInfo(NODE.originalFileName)


        if (!moduleInfo.isNodeModule) {
            chokidar.watch(NODE.originalFileName).on('change', (event, path) => {
                console.log("chokidar___", event, path);
            });
        }

        CTX.ModuleColection = configModules(NODE, moduleInfo, compilerOptions)
        


        NODE.statements = NODE.statements.flatMap((node) => topLevelVisitor(node, CTX))
        // collectExternalModuleInfo


        try {
            if (ts.isJsonSourceFile(NODE)) {
                NODE.scriptKind = ScriptKind.Unknown
                NEWSTATEMENT.push(createExpressionStatement(CREATE_Property_Access_Equals_Token(CREATE_Object_WiTH_String_Keys([
                    [createIdentifier("default"), NODE.statements[0].expression]
                ]), [compilerOptions.__Import_Module_Name, getColumnName(moduleInfo.Module_INDEX)])))

            } else {
                NEWSTATEMENT.push(createExpressionStatement(CREATE_Export_File_Function(NODE.statements, compilerOptions.__Import_Module_Name, moduleInfo.Module_INDEX)))
            }


            NODE.statements = NEWSTATEMENT
            NODE.externalModuleIndicator = undefined
        } catch (error) {
            console.log(error)
        }

        NODE.before_visited = true;
        return visitEachChild(NODE, visitor, CTX)
    }
}


export const ModuleTransformersAfter = {
    [SyntaxKind.SourceFile]: (NODE, visitor, CTX) => {
        if (NODE.After_visited) return NODE

        NODE.After_visited = true;
        return NODE
    }
}

