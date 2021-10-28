import { getDirectoryPath, SyntaxKind, visitEachChild, factory, normalizeSlashes } from "typescript"
import resolve from "resolve"
import chokidar from "chokidar"


const {
    createToken,
    createBinaryExpression,
    createVariableStatement,
    createVariableDeclarationList,
    createVariableDeclaration,
    createBlock,
    createIdentifier,
    createPropertyAccessExpression,
    createObjectLiteralExpression,
    createParameterDeclaration,
    createParenthesizedExpression,
    createArrowFunction,
    createCallExpression,
    createObjectBindingPattern,
    createBindingElement
} = factory





// მოდულის შესახებ ინფორმაციის ქეშირება
export const ModulesThree = new Map()
let Module_INDEX = 0
export const getOrSetModuleInfo = (pathKey) => {

    const module = ModulesThree.get(pathKey)
    const moduleInfo = module || {
        Module_INDEX: Module_INDEX++
    }
    if (!module) {
        ModulesThree.set(pathKey, moduleInfo)
    }

    return moduleInfo
}




















export const configModules = (NODE, moduleInfo, compilerOptions) => {

    const fileDirectory = getDirectoryPath(NODE.originalFileName)
    const oldNodeModules = moduleInfo.NodeModules || {}
    const NodeModules = {}
    const LocalModules = {}
    const ModuleColection = NODE.imports.reduce((ModuleColection, ModuleNode) => {
        const { text, parent, kind } = ModuleNode

        const modulePath = resolveModule(text, fileDirectory)
        if (!modulePath) {
            return ModuleColection
        }
        const module = ModulesThree.get(modulePath)

        const childModuleInfo = module || {
            Module_INDEX: Module_INDEX++
        }
        if (!module) {
            ModulesThree.set(modulePath, childModuleInfo)
        }


        const ModuleKindName = SyntaxKind[parent?.expression?.kind]
        childModuleInfo.KindName = ModuleKindName


        if ((/[/\\]node_modules[/\\]/).test(modulePath)) {
            childModuleInfo.isNodeModule = true
            NodeModules[modulePath] = childModuleInfo
            if (!oldNodeModules[modulePath]) {
                compilerOptions.resetModuleFiles()
            }

        } else {
            LocalModules[modulePath] = childModuleInfo;
        }

        ModuleColection[text] = childModuleInfo
        return ModuleColection
    }, {})
    moduleInfo.ModuleColection = ModuleColection
    moduleInfo.NodeModules = NodeModules
    moduleInfo.LocalModules = LocalModules
    return ModuleColection
}




function resolveModule(modulePath, fileDirectory) {
    try {
        return normalizeSlashes(resolve.sync(modulePath, {
            basedir: fileDirectory,
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        }))
    } catch (e) {

    }
}










const concatBeforOrAfterTransformers = (BeforeOrAfter, transfromers = {}) => {
    for (const transformersObject of BeforeOrAfter) {
        for (const transfromersKey in transformersObject)
            if (transfromersKey in transfromers) {
                const transfromer = transfromers[transfromersKey]
                const newtransfromer = transformersObject[transfromersKey]
                transfromers[transfromersKey] = (node, ...args) => newtransfromer(transfromer(node, ...args), ...args)
            } else {
                transfromers[transfromersKey] = transformersObject[transfromersKey]
            }
    }
    return transfromers
}















export const getTransformersObject = (before, after) => {
    const transpilerBefore = concatBeforOrAfterTransformers(before)
    const transpilerAfter = concatBeforOrAfterTransformers(after)
    return {
        before: [
            (CTX) => {
                const visitor = (NODE) => {

                    // console.log(SyntaxKind[NODE.kind])

                    // return visitEachChild(NODE, visitor, CTX)
                    return (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
                }

                return visitor
            }
        ],
        // after: [
        //     (CTX) => {
        //         const visitor = (NODE) => {

        //             // console.log(SyntaxKind[NODE.kind])

        //             return (transpilerAfter[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
        //         }

        //         return visitor
        //     }
        // ]
    }
}










export const createObjectPropertyLoop = (namesObject, returnValue = []) => {
    for (const nameKey in namesObject) {
        const value = namesObject[nameKey]
        returnValue.push(createBindingElement(
            undefined,
            value && createIdentifier(nameKey),
            value && createObjectPropertyLoop(value) || createIdentifier(nameKey),
            undefined
        ))

    }
    return createObjectBindingPattern(returnValue)
}