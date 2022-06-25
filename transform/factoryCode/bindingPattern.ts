import ts from "typescript";
import { identifier } from "./identifier";

type keyType = string | ts.Identifier
type createType = "createArrayBindingPattern" | "createObjectBindingPattern"
type equalsToType = ts.Expression | undefined
type Elements = [keyType, PatternType | undefined, equalsToType][]
export type PatternType = {
    elements: Elements,
    type: createType
}

const factory = ts.factory;
export const bindingPattern = (pattern: PatternType) => {

    return factory[pattern.type](pattern.elements.reduce((bindElements: ts.BindingElement[], item) => {
        const propertyName = item[1] && item[0]
        const name = item[1] ? bindingPattern(item[1]) : identifier(item[0])
        bindElements.push(
            factory.createBindingElement(
                undefined,
                propertyName,
                name,
                item[2]
            )
        )
        return bindElements
    }, []))
} 