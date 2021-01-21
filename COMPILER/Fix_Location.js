const path = require('path');
const fs = require("fs");
const typ = require('typescript/lib/cancellationToken');
const globalModules = require('global-modules');


function get_location(url, req_array) {

    if (req_array) {

        if (req_array.length == 1 && fs.existsSync(url + '/package.json')) {
            var pkg_main = require(url + '/package.json').main
            if (pkg_main) {
                url = url + '/' + pkg_main;
            }
        } else {
            url = url + '/' + req_array.join('/')
        }


    }
    return path.resolve(path.extname(url) ? url : url + '.js');
}

module.exports = function (DATA) {

    var request_url = "/" + DATA.Import_Location;
    var req_array = request_url.trim().split('/');



    // console.log(request_url, /^[.|..]|^\s*$/.test("d"))
    if (!/^[.|..]|^\s*$/.test(req_array[0])) {
        // if (!['.', '..', ''].includes(req_array[0])) {
        // fs.existsSync(location)
        var global_module = path.resolve(globalModules + '/' + request_url),
            local_module = path.resolve(DATA.Run_Dir + '/node_modules/' + request_url);



        // console.log(global_module, 'ssssssssssssssssss') 
        // console.log(local_module, 'ssssssssssssssssss')

        if (fs.existsSync(local_module)) {
            var location = get_location(local_module, req_array)


        } else if (fs.existsSync(global_module)) {
            var location = get_location(global_module, req_array)


        } else {
            new Error(`import module ${DATA.Import_Location} NOT EXIST`)
        }
    } else {
        var location = get_location(DATA.File_Start_Dir + '/' + DATA.Import_Location)
    }




    return location
}