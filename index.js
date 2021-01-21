#!/usr/bin/env node
const copyFolderSync = require("./source/copyFolderSync");
const Dist_Build = require('./COMPILER/Dist_Build')
const prompts = require('prompts');
const New_Product = require("./source/New_Product")



var runed_dir = process.cwd(),
  arguments = process.argv.slice(2),
  i = 0;

while (i < arguments.length) {
  switch (arguments[i]) {
    case "new":
 
      i = New_Product(arguments, i, runed_dir); 
      break;
    case "start":
      require("./source/express_controler.js")(runed_dir);
      break;
    case "build":
      Dist_Build(runed_dir);
      break;
  }
  i++;
} 
