#!/usr/bin/env node

const yargs_parser = require('yargs-parser')


var runed_dir = process.cwd(),
  arguments = yargs_parser(process.argv.slice(2)),
  i = 0;
global.COMMANDS = arguments


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
