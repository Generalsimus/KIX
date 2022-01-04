"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xhrGetRequet = void 0;
const xhrGetRequet = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    });
    xhr.open("GET", url);
    xhr.send();
    return xhr;
};
exports.xhrGetRequet = xhrGetRequet;
