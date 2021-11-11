"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceMapCachedData = void 0;
const xhrRequest_1 = require("../xhrRequest");
const sourceMapCache = {};
const getSourceMapCachedData = (sourceMapUrl, callback) => {
    const cachedData = sourceMapCache[sourceMapUrl];
    if (cachedData instanceof Array) {
        cachedData.push(callback);
    }
    else if (cachedData instanceof Object) {
        callback(cachedData);
    }
    else {
        sourceMapCache[sourceMapUrl] = [callback];
        (0, xhrRequest_1.xhrGetRequet)(sourceMapUrl, (responseText) => {
            try {
                const sourceMapObject = JSON.parse(responseText);
                for (const cachedCallback of sourceMapCache[sourceMapUrl]) {
                    cachedCallback(sourceMapObject);
                }
                sourceMapCache[sourceMapUrl] = sourceMapObject;
            }
            catch (e) {
            }
        });
    }
};
exports.getSourceMapCachedData = getSourceMapCachedData;
