var fs = require("fs")
var ts = require("typescript")




module.exports = function (DATA, transpileOptions) {
    var diagnostics = [];
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
    var sourceFile = DATA.SourceFile; // TODO: GH#18217
    if (transpileOptions.moduleName) {
        sourceFile.moduleName = transpileOptions.moduleName;
    }
    if (transpileOptions.renamedDependencies) {
        sourceFile.renamedDependencies = new ts.Map(ts.getEntries(transpileOptions.renamedDependencies));
    }
    var newLine = ts.getNewLineCharacter(options);
    // Output
    var outputText;
    var sourceMapText;
    // Create a compilerHost object to allow the compiler to read and write files
    var compilerHost = {
        getSourceFile: function (fileName) {
            return fileName === ts.normalizePath(inputFileName) ? sourceFile : undefined;
        },
        writeFile: function (name, text) {
            if (ts.fileExtensionIs(name, ".map")) {
                ts.Debug.assertEqual(sourceMapText, undefined, "Unexpected multiple source map outputs, file:", name);
                sourceMapText = text;
            } else {
                ts.Debug.assertEqual(outputText, undefined, "Unexpected multiple outputs, file:", name);
                outputText = text;
            }
        },
        getDefaultLibFileName: function () {
            return "lib.d.ts";
        },
        useCaseSensitiveFileNames: function () {
            return false;
        },
        getCanonicalFileName: function (fileName) {
            return fileName;
        },
        getCurrentDirectory: function () {
            return "";
        },
        getNewLine: function () {
            return newLine;
        },
        fileExists: function (fileName) {
            return fileName === inputFileName;
        },
        readFile: function () {
            return "";
        },
        directoryExists: function () {
            return "";
        },
        getDirectories: function () {
            return [];
        }
    };

    var program = ts.createProgram([inputFileName], options, compilerHost);
    // const diagnosticsss = ts.getPreEmitDiagnostics(program);
    // function getPreEmitDiagnostics(program, sourceFile, cancellationToken) {
    //     var diagnostics;
    // diagnostics = ts.addRange(diagnostics, program.getConfigFileParsingDiagnostics());
    // diagnostics = ts.addRange(diagnostics, program.getOptionsDiagnostics(cancellationToken));
    // diagnostics = ts.addRange(diagnostics, program.getSyntacticDiagnostics(sourceFile, cancellationToken));
    // diagnostics = ts.addRange(diagnostics, program.getGlobalDiagnostics(cancellationToken));
    // diagnostics = ts.addRange(diagnostics, program.getSemanticDiagnostics(sourceFile, cancellationToken));
    //     if (ts.getEmitDeclarations(program.getCompilerOptions())) {
    //         diagnostics = ts.addRange(diagnostics, program.getDeclarationDiagnostics(sourceFile, cancellationToken));
    //     }
    //     return ts.sortAndDeduplicateDiagnostics(diagnostics || ts.emptyArray);
    // }

    // if (transpileOptions.reportDiagnostics) {
    // ts.addRange( /*to*/ diagnostics, /*from*/ program.getSyntacticDiagnostics(sourceFile));

    // ts.addRange(diagnostics, program.getConfigFileParsingDiagnostics());
    // ts.addRange(diagnostics, program.getOptionsDiagnostics());
    // ts.addRange(diagnostics, program.getSyntacticDiagnostics(sourceFile));
    // ts.addRange(diagnostics, program.getGlobalDiagnostics());
    // ts.addRange(diagnostics, program.getSemanticDiagnostics(sourceFile));
    // ts.addRange( /*to*/ diagnostics, /*from*/ program.getOptionsDiagnostics());
    // }
    // console.log(sourceFile)
    // for (var prop_file in DATA.Files) {
    //     var transform_DATA = DATA.Files[prop_file].DATA;
    //     console.log(transform_DATA.SourceFile)
    //     if(!transform_DATA.VISITED && transform_DATA.SourceFile){
    //         // Location
    //     }
    //     console.log(prop_file,transform_DATA.VISITED)
    // }

    // for (const diagnostic of diagnostics) {
    //     const message = diagnostic.messageText;
    //     const file = diagnostic.file;
    //     const filename = file.fileName;

    //     const lineAndChar = file.getLineAndCharacterOfPosition(
    //         diagnostic.start
    //     );

    //     const line = lineAndChar.line + 1;
    //     const character = lineAndChar.character + 1;

    //     console.log(message);
    //     console.log(`(${filename}:${line}:${character})`);
    // }
    // Emit
    program.emit( /*targetSourceFile*/ undefined, /*writeFile*/ undefined, /*cancellationToken*/ undefined, /*emitOnlyDtsFiles*/ undefined, transpileOptions.transformers);

    if (outputText === undefined)
        return ts.Debug.fail("Output generation failed");
    return {
        outputText: outputText,
        diagnostics: diagnostics,
        sourceMapText: sourceMapText
    };
}

