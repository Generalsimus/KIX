var fs = require("fs")
var ts = require("typescript")


function Program_Host(transpileOptions, writeFile, sourceFile) {
    // var diagnostics = [];
    var options = transpileOptions.compilerOptions;
    // mix in default options
    var defaultOptions = ts.getDefaultCompilerOptions();

    for (var key in defaultOptions) {
        if (ts.hasProperty(defaultOptions, key) && options[key] === undefined) {
            options[key] = defaultOptions[key];
        }
    }
    for (var _i = 0, transpileOptionValueCompilerOptions_1 = ts.transpileOptionValueCompilerOptions; _i < transpileOptionValueCompilerOptions_1.length; _i++) {
        var option = transpileOptionValueCompilerOptions_1[_i];
        options[option.name] = option.transpileOptionValue;
    }
    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
    options.suppressOutputPathCheck = true;
    // Filename can be non-ts file.
    options.allowNonTsExtensions = true;
    // if jsx is specified then treat file as .tsx
    var inputFileName = transpileOptions.fileName || (transpileOptions.compilerOptions && transpileOptions.compilerOptions.jsx ? "module.jsx" : "module.jsx");
    // var sourceFile = DATA.SourceFile; // TODO: GH#18217
    if (transpileOptions.moduleName) {
        sourceFile.moduleName = transpileOptions.moduleName;
    }
    // console.log(transpileOptions.moduleName)
    if (transpileOptions.renamedDependencies) {
        sourceFile.renamedDependencies = new ts.Map(ts.getEntries(transpileOptions.renamedDependencies));
    }
    var newLine = ts.getNewLineCharacter(options);

    // Create a compilerHost object to allow the compiler to read and write files
    var compilerHost = {
        getSourceFile: (name, languageVersion) => sourceFile,
        writeFile: writeFile,
        getDefaultLibFileName: () => "lib.d.ts",
        useCaseSensitiveFileNames: () => false,
        getCanonicalFileName: filename => filename,
        getCurrentDirectory: () => "",
        getNewLine: () => newLine,
        directoryExists: () => "",
        getDirectories: () => [],
        fileExists: () => true,
        readFile: () => ""
    };

    return ts.createProgram([inputFileName], options, compilerHost);
}



function Transpile_Module(DATA, transpileOptions) {
    // Output
    var outputText;
    var sourceMapText;
    var program = Program_Host(transpileOptions, function (name, text) {
        if (ts.fileExtensionIs(name, ".map")) {
            ts.Debug.assertEqual(sourceMapText, undefined, "Unexpected multiple source map outputs, file:", name);
            sourceMapText = text;
        } else {
            ts.Debug.assertEqual(outputText, undefined, "Unexpected multiple outputs, file:", name);
            outputText = text;
        }
    }, DATA.SourceFile)






    // Emit
    program.emit( /*targetSourceFile*/ undefined, /*writeFile*/ undefined, /*cancellationToken*/ undefined, /*emitOnlyDtsFiles*/ undefined, transpileOptions.transformers);





    if (outputText === undefined)
        return ts.Debug.fail("Output generation failed");
    return {
        outputText: outputText,
        diagnostics: [],
        sourceMapText: sourceMapText
    };
}

module.exports = {
    Transpile_Module: Transpile_Module,
    Program_Host: Program_Host
}