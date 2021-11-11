import { xhrGetRequet } from "../xhrRequest"

const sourceMapCache = {}
export const getSourceMapCachedData = (sourceMapUrl, callback) => {
    const cachedData = sourceMapCache[sourceMapUrl]
    if (cachedData instanceof Array) {
        cachedData.push(callback)
    } else if (cachedData instanceof Object) {
        callback(cachedData)
    } else {
        sourceMapCache[sourceMapUrl] = [callback]
        xhrGetRequet(sourceMapUrl, (responseText) => {
            try {
                const sourceMapObject = JSON.parse(responseText)
                for (const cachedCallback of sourceMapCache[sourceMapUrl]) {
                    cachedCallback(sourceMapObject)
                }
                sourceMapCache[sourceMapUrl] = sourceMapObject
            } catch (e) {
            }
        })

    }


}