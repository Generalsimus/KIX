const ts = require("typescript");
const factory = ts.factory;

// const {
//   Replace_object
// } = require("./Selectors_List");


var getColumnName = (i) => {
  var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    l = a.length,
    p = i >= l ? getColumnName(Math.floor(i / l) - 1) : "",
    ls = a[i % l];
  return p + ls;
};

module.exports = {
  CREATE_Auto_Call_Function(ARGS = [], BODY = [], PARAM_Declaration = []) {
    return factory.createCallExpression(
      factory.createParenthesizedExpression(factory.createFunctionExpression(
        undefined,
        undefined,
        undefined,
        undefined,
        PARAM_Declaration.map(par => factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(par),
          undefined,
          undefined,
          undefined
        )),
        undefined,
        factory.createBlock(
          BODY,
          true
        )
      )),
      undefined,
      ARGS
    )

  },
  CREATE_File_Imported: function (DATA, body, NAME) {
    // const externalCssSource = ts.createSourceMapSource(
    //   DATA.Location,
    //   DATA.CODE_SCRIPT
    // );
    // console.log(externalCssSource)

    // ts.setSourceMapRange(n, externalCssSource)
    return factory.createExpressionStatement(factory.createBinaryExpression(
      this.CREATE_Access_ElementAccess(
        this.CREATE_Identifier("imports"),
        DATA.IMPORTS_INDEX
      ),
      ts.createToken(ts.SyntaxKind.EqualsToken),
      this.CREATE_Auto_Call_Function([this.CREATE_Object([])], [...body,
      factory.createReturnStatement(factory.createIdentifier("exports"))
      ], ["exports"])

    ))
  },
  CREATE_Call_FUNCTION: function (NAME, ARGS) {
    return factory.createCallExpression(
      this.CREATE_Identifier(NAME),
      undefined,
      ARGS
    )
  },
  CREATE_JSX_REGISTRATOR: function () {
    return this.CREATE_Call_FUNCTION("KD_G", [this.CREATE_Arrow_Function()])
  },
  CREATE_Throw_Statement: function (ARG) {
    return factory.createThrowStatement(ARG)
  },
  CREATE_Object: function (Propertys) {
    return factory.createObjectLiteralExpression(
      Propertys,
      false
    )
  },
  CREATE_Property: function (NAME, VALUE, STRING) {
    return factory.createPropertyAssignment(
      STRING ? factory.createStringLiteral(typeof NAME == "string" ? NAME : NAME.escapedText) : this.CREATE_Identifier(NAME),
      VALUE
    )
  },
  CREATE_TEXT: function (TEXT) {
    return factory.createStringLiteral(TEXT)
  },
  CREATE_ARRAY: function (ELEMENTS = []) {
    return factory.createArrayLiteralExpression(
      ELEMENTS,
      false
    )
  },
  NO_Function_Atributes: [
    "e"
  ],
  CREATE_Function: function (BODY) {
    return factory.createFunctionExpression(
      undefined,
      undefined,
      undefined,
      undefined,
      [],
      undefined,
      factory.createBlock(
        BODY,
        true
      )
    )
  },
  CREATE_Return: function (VALUE) {
    return factory.createReturnStatement(VALUE)
  },
  CREATE_Variable: function (DECLARATIONS) {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        DECLARATIONS,
        ts.NodeFlags.None
      )
    )
  },
  CREATE_Declaration: function (NAME, VALUE) {
    return factory.createVariableDeclaration(
      this.CREATE_Identifier(NAME),
      undefined,
      undefined,
      VALUE
    )
  },
  CREATE_Access_Property: function (OBJECT, PROPERTY) {
    return factory.createPropertyAccessExpression(
      OBJECT,
      typeof PROPERTY == 'string' ? this.CREATE_Identifier(PROPERTY) : PROPERTY
    )
  },
  CREATE_Access_ElementAccess: function (Object, INDEX) {
    return factory.createElementAccessExpression(
      Object,
      factory.createNumericLiteral(INDEX)
    )
  },
  CREATE_Identifier: function (NAME) {
    return typeof NAME == "string" ? factory.createIdentifier(NAME) : NAME
  },
  CREATE_This: function () {
    return factory.createThis()
  },
  // CREATE_Export: function (PROPERTY, VARIABLE) {
  //   return factory.createExpressionStatement(this.CREATE_Call_FUNCTION("KD_E", [
  //     this.CREATE_Identifier("KD_export"),
  //     factory.createStringLiteral(PROPERTY),
  //     factory.createFunctionExpression(
  //       undefined,
  //       undefined,
  //       undefined,
  //       undefined,
  //       [],
  //       undefined,
  //       factory.createBlock(
  //         [factory.createReturnStatement(typeof VARIABLE == 'string' ? this.CREATE_Identifier(VARIABLE) : VARIABLE)],
  //         true
  //       )
  //     )
  //   ]))
  // },
  CREATE_Access_Object_Property: function (object, property, value) {
    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(
          this.CREATE_Identifier(object),
          this.CREATE_Identifier(property)
        ),
        ts.createToken(ts.SyntaxKind.EqualsToken),
        value
      ))
  },
  CREATE_Object_Property: function (object, property, value) {
    return factory.createPropertyAccessExpression(
      this.CREATE_Identifier(object),
      this.CREATE_Identifier(property)
    )
  },
  CREATE_Call_Property: function (object, property, arguments) {
    return factory.createExpressionStatement(factory.createCallExpression(
      factory.createPropertyAccessExpression(
        this.CREATE_Identifier(object),
        this.CREATE_Identifier(property)
      ),
      undefined,
      arguments
    ))
  },
  CREATE_Arrow_Function: function (RETURN_BODY = [], ARGS = []) {
    return factory.createArrowFunction(
      undefined,
      undefined,
      ARGS.map(par => factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(par),
        undefined,
        undefined,
        undefined
      )),
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      RETURN_BODY
    )
  }
};