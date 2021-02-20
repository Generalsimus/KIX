const fs = require("fs");
const ts = require('typescript')
const path = require("path")
const consola = require('consola')

// const { SourceMapConsumer } = require("source-map")

const JS_JSX_TS_TSX = require("./Modifer/IMPORTS_FILES/JS_JSX_TS_TSX")
const CSS = require("./Modifer/IMPORTS_FILES/CSS")
const BASE64 = require("./Modifer/IMPORTS_FILES/BASE64")
const JS_JSON = require("./Modifer/IMPORTS_FILES/JS_JSON")
const STRING = require("./Modifer/IMPORTS_FILES/STRING")
const FILE_NOT_EXIST = require("./Modifer/IMPORTS_FILES/FILE_NOT_EXIST")

const Clone_Json = require("./Modifer/Clone_Json")
const { Import_File } = require("./Modifer/SourceFile_Helper")
const Fix_Location = require("./Fix_Location")
const SourceFile_Map_Object = require("./Modifer/SourceFile_Map_Object");


global.Compiler = function (DATA) {
  var location = Fix_Location(DATA);



  if (DATA.Files[location] && DATA.Files[location].DATA.File_Ext != "FILE_NOT_EXIST") {
    return DATA.Files[location].DATA
  }
  if (fs.existsSync(location)) {
    var CODE_SCRIPT = fs.readFileSync(location, "utf8");
    if (DATA.DEVELOPER_MOD && !DATA.WATCHED) {
      // DATA.WATCHED = true

      fs.watch(location, (method) => {
        console.save()
        delete DATA.Files[location]

        Import_File(DATA.Import_Location, DATA, DATA)
        DATA.RESET_REQUEST_FILE()
        KD_RESTART_PAGE()
        consola.success(path.relative(DATA.Run_Dir, DATA.Location) + `\x1b[32m COMPILED\x1b[0m`)


      })
    }
    var File_Ext = path.extname(location).replace('.', '').toUpperCase();
  } else {
    new Error(`ERROR:FILE NOT EXIST ` + location);
    var File_Ext = "FILE_NOT_EXIST"
  }

  Object.assign(DATA, {
    Location: location,
    PARENT_Location: DATA.Location,
    PARENT_CODE_SCRIPT: DATA.CODE_SCRIPT,
    VISITED: false,
    // CHANGE_LISTENER: false,
    // SourceMapConsumer: false,
    // SourceMap_VQL: undefined,
    // WATCHED: false,
    File_Ext: File_Ext,
    ERRORS: [],
    CODE_SCRIPT: CODE_SCRIPT || " ",
    externalSource: false,
    Import_Name: Clone_Json.CREATE_Access_ElementAccess(
      Clone_Json.CREATE_Identifier("imports"),
      DATA.IMPORTS_INDEX
    )
  })

  // console.log(location, File_Ext)

  switch (File_Ext) {
    case "FILE_NOT_EXIST":
      var statements = FILE_NOT_EXIST(DATA)
      break;
    case 'JS':
    case 'JSX':
    case 'TS':
    case 'TSX':
      var statements = JS_JSX_TS_TSX(DATA)
      break;
    case 'JSON':
      var statements = JS_JSON(DATA)
      break;
    case 'CSS':
    case 'SCSS':
      var statements = CSS(DATA)
      break;
    // base64 IMAGES
    case "APNG":
    case "AVIF":
    case "GIF":
    case "JPG":
    case "JPEG":
    case "JFIF":
    case "PJPEG":
    case "PJP":
    case "PNG":
    case "APNG":
    case "SVG":
    case "WEBP":
    case "BMP":
    case "ICO":
    case "CUR":
    case "TIF":
    case "TIFF":
    ////////////////
    // base64 AUDIO/VIDEO
    case "3GP":
    case "ACC":
    case "FLAC":
    case "MPG":
    case "MPEG":
    case "MP3":
    case "MP4":
    case "M4V":
    case "M4P":
    case "M4A":
    case "OGA":
    case "OGV":
    case "OGG":
    case "WAV":
    case "MOV":
    case "WEBM":
      ///////////////////
      var statements = BASE64(DATA)
      break;
    default:
      var statements = STRING(DATA)
      break;
  }

  DATA.Files[location] = {
    statements,
    FILES_PATH: {},
    DATA
  }

  return DATA
}

function Run_Compiler(DATA, FILE_LOCATION) {

  var DATA = Compiler({
    ...DATA,
    Import_Location: path.relative(DATA.Run_Dir, FILE_LOCATION),
    // .replace(DATA.Run_Dir, ""), 
    File_Start_Dir: DATA.Run_Dir,
    File_Start_loc: FILE_LOCATION,
    REGISTER_PROP_NAME: `KD_${new Date().getTime()}_PROP_REGIST_22_${new Date().getTime()}_22_RATOR_PROP_${new Date().getTime()}_KD`,
    IMPORTS_INDEX: 0
  })

  // CREATE_STATEMENTS(DATA)

  var COMPIL_SCRIPT = SourceFile_Map_Object(DATA);
  DATA.COMPIL_SCRIPT = COMPIL_SCRIPT;



  var map_file_url = path.relative(DATA.Run_Dir, DATA.Location).replace(/\\/g, "/")

  // console.log(COMPIL_SCRIPT)

  // fs.writeFile(
  //   "response_JS_JS.js",
  //   COMPIL_SCRIPT.outputText, {
  //   encoding: "utf-8"
  // },
  //   (err) => {
  //     console.log("save SourceFile.json");
  //   }
  // );

  consola.success(map_file_url + `\x1b[32m COMPILED\x1b[0m`)
  if (DATA.DEVELOPER_MOD) {
    watch_directory[`/${map_file_url}.map`] = function () {
      return COMPIL_SCRIPT.sourceMapText;
    }

  }
  // console.save("COMPILED", "green")(0)
  // console.log(COMPIL_SCRIPT.outputText)
  return { code: COMPIL_SCRIPT.outputText, DATA }
}

module.exports = Run_Compiler;