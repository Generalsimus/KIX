#!/usr/bin/env node

const yargs_parser = require('yargs-parser')
const path = require('path')
const fs = require('fs')


var runed_dir = process.cwd(),
  arguments = yargs_parser(process.argv.slice(2)),
  i = 0;
global.COMMANDS = arguments
global.P_K_G = {}
global.C_O = {}


try {
  var pkg_url = path.join(runed_dir, "/package.json")
  if (fs.existsSync(pkg_url)) {
    var P_K_G = JSON.parse(fs.readFileSync(pkg_url))
    global.P_K_G = P_K_G || {}

    if ("compilerOptions" in P_K_G && typeof P_K_G.compilerOptions === "object") {
      global.C_O = P_K_G.compilerOptions || {}
    }

  }
} catch { }



while (i < arguments._.length) {
  // console.log(arguments._[i])
  switch (arguments._[i].toLocaleLowerCase()) {
    case "new":
      i++

      require("./source/New_Product")(arguments._[i], runed_dir);
      break;
    case "start":
    case "serve":
      require("./source/express_controler.js")(runed_dir);
      break;
    case "build":
    case "dist":
      require('./COMPILER/Dist_Build')(runed_dir);
      break;
  }
  i++;
}
