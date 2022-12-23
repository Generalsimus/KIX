import ts from "typescript";

const factory = ts.factory;

export const parameterDeclaration = (params: (string | ts.BindingName)[] = []) => {
    return params.map(param => {
        return factory.createParameterDeclaration(
            undefined,
            undefined,
            param,
            undefined,
            undefined,
            undefined
        )
    })
}