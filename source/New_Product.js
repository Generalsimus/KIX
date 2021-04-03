const prompts = require('prompts');
var fs = require("fs");
const URL = require("url").URL;
const copyFolderSync = require("./copyFolderSync")
const path = require("path")
const consola = require("consola")

var valid_folder = /^[^\u0022\u003C\u003E\u007C\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000A\u000B\u000C\u000D\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F\u003A\u002A\u003F\u005C\u002F]*$/;



module.exports = function (product_name, runed_dir) {

    // console.error();
    function CREATE_PROJECT(PROJECT_NAME) {
        // !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(PROJECT_NAME) &&
        if (valid_folder.test(PROJECT_NAME)) {
            var dir = path.resolve((COMMANDS.DIR || runed_dir) + "/" + PROJECT_NAME);


            if (fs.existsSync(dir)) {

                return `FOLDER NAMED "${PROJECT_NAME}" EXIST`
            } else {


                // console.log('\x1b[32m%s\x1b[0m', `Project "${PROJECT_NAME}" Created`);

                return true
            }
        } else {
            return 'Input contains invalid characters!'
        }

    }
    function COPY_TEMPLATE(PROJECT_NAME) {
        var dir = path.resolve((COMMANDS.DIR || runed_dir) + "/" + PROJECT_NAME);
        prompts([{
            type: 'select',
            name: 'value',
            message: 'Pick a color',
            choices: [
                // description: 'This option has a description'
                { title: 'Javascript Template ', value: 'JS', description: 'RECOMMENDED'},
                { title: 'Typescript Template ', value: 'TS' }
            ],
            // initial: 0
            // onRender:function(state){
            //     console.log(arguments)
            // }
        }]).then(function ({ value }) {
            var P_K_G = {
                name: PROJECT_NAME,
                version: "1.0.0",
                private: true,
                scripts: {
                    start: "kix start",
                    build: "kix build"
                },
                compilerOptions: {
                    target: "es2020"
                },
                dependencies: {
                }
            }

            copyFolderSync(__dirname + "/../DEMO_TEMPLATE/" + value + "/", dir);
            fs.writeFile(dir + "/package.json", JSON.stringify(P_K_G, null, "\t"),
                { encoding: "utf-8" }, (e) => {
                    console.clear();
                    console.log('\x1b[32m%s\x1b[0m', `Project "${PROJECT_NAME}" Created`);
                    consola.info(`Location: `, dir)
                }
            );
        })
    }


    if (!fs.existsSync(COMMANDS.DIR || runed_dir)) {
        // Directory Does Not
        console.log('\x1b[31m%s\x1b[0m', `Directory Does Not Exist:  \n"${COMMANDS.DIR || runed_dir}"`)
        // return 
    } else if (product_name) {
        var res = CREATE_PROJECT(product_name);
        if (res != true) {
            console.log('\x1b[31m%s\x1b[0m', res)
        } else {

            COPY_TEMPLATE(product_name)
        }
    } else {
        prompts([{
            type: 'text',
            name: 'value',
            message: 'Please specify the project name:',
            validate: value => {
                // var dir = runed_dir + "/" + value;

                return CREATE_PROJECT(value)
                // return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value) ? true : 'Input contains invalid characters!'
            }
        }]).then(function ({ value }) {
            COPY_TEMPLATE(value)
        })
    }
}






















// const old = (arguments, i, runed_dir) => {

//     function PackageJSON(name) {

//         prompts({
//             type: 'toggle',
//             name: 'value',
//             message: 'Use without package.json?',
//             active: 'NO',
//             inactive: 'YES'
//         }).then(v => {
//             if (v.value) {
//                 prompts([{
//                     type: 'text',
//                     name: 'name',
//                     message: 'package name:',
//                     validate: value => {
//                         return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value) ? true : 'Input contains invalid characters!'
//                     }
//                 }, {
//                     type: 'text',
//                     name: 'version',
//                     initial: "1.0.0",
//                     message: 'version: (1.0.0)',
//                     validate: value => {
//                         return !value.length || /^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(value) ? true : `Invalid version: "${value}"`
//                     }
//                 }, {
//                     type: 'text',
//                     name: 'description',
//                     message: 'description:'
//                 }, {
//                     type: 'text',
//                     name: 'repository',
//                     format: v => {
//                         return v.trim().length ? {
//                             "type": "git",
//                             "url": v
//                         } : {}
//                     },
//                     message: 'git repository:'
//                 }, {
//                     type: 'text',
//                     name: 'keywords',
//                     format: v => {

//                         return v.trim().length ? v.split(',') : []
//                     },
//                     message: 'keywords:'
//                 }, {
//                     type: 'text',
//                     name: 'author',
//                     message: 'author:'
//                 }, {
//                     type: 'text',
//                     name: 'license',
//                     initial: "ISC",
//                     message: 'license: (ISC)'
//                 }
//                 ]).then(v => {

//                     fs.writeFile(runed_dir + '/' + name + "/package.json", JSON.stringify(Object.assign(v, {
//                         "scripts": {
//                             "start": "kix start",
//                             "build": "kix build",
//                         },
//                         "babel_targets": [
//                             ">0.2%",
//                             "not dead",
//                             "not op_mini all"
//                         ],
//                         // CSS_
//                         // ">0.2%",
//                         // "not dead",
//                         // "not op_mini all"
//                         "dependencies": {},
//                         "devDependencies": {}
//                     }), null, "\t"),
//                         { encoding: "utf-8" }, (e) => {
//                             // console.clear();
//                             console.log('\x1b[32m%s\x1b[0m', `Project "${name}" Created`);
//                         }
//                     );
//                 })


//             } else {
//                 // \x1b[37m 
//                 // console.clear()
//                 // console.log('\x1b[37m%s\x1b[0m', `Created a new KIX app in `, '\x1b[32m', path.resolve(runed_dir + '/' + name));
//                 console.log('\x1b[32m%s\x1b[0m', `Project "${name}" Created`);
//                 // Creating a new React app in C:\Users\totor\OneDrive\Desktop\sdsd.
//             }
//         })
//     }
//     function new_product(name) {
//         var dir = runed_dir + "/" + name;
//         if (valid_folder.test(name)) {
//             if (fs.existsSync(dir)) {
//                 return `FOLDER NAMED "${name}" EXIST`
//             } else {

//                 copyFolderSync(__dirname + "/../DEMO_TEMPLATE", dir);
//                 // console.clear()


//                 return true
//             }
//         } else {
//             return 'Input contains invalid characters!'
//         }
//     }

//     if (arguments[i + 1]) {
//         var result = new_product(arguments[i + 1])
//         if (result == true) {
//             PackageJSON(arguments[i + 1])
//         } else {
//             console.error('\x1b[31m%s\x1b[0m', result);
//         }
//     } else {
//         prompts([{
//             type: 'text',
//             name: 'value',
//             message: 'Please specify the project directory:',
//             validate: value => {
//                 return new_product(value)
//             }
//         }]).then(v => {
//             PackageJSON(v.value)
//         })
//     }





//     return i++;
// }