import { ClassDeclaration } from "typescript";
import { createProgramHost } from ".";



export class CacheController {
    host: createProgramHost
    options: Record<string, number>
    constructor(host: createProgramHost, options: Record<string, number>) {
        this.host = host
        this.options = options
        this.initOptions();
    }
    cache: Record<string, Map<string, any>> = {}
    initOptions() {
        for (const propertyName in this.options) {
            const descriptor = Object.getOwnPropertyDescriptor(this.host, propertyName);
            if (!descriptor) return;
            const propertyValue = descriptor.value.bind(this.host);
            const currentCache = this.cache[propertyName] = new Map<string, any>();
            const ArgumentsIndex = this.options[propertyName];
            (this.host as any)[propertyName] = (...args: any[]) => {
                // console.log(currentCache.keys())
                return currentCache.get(args[ArgumentsIndex]) || (currentCache.set(args[ArgumentsIndex], (args = propertyValue(...args))), args)
            }
        }

    }
    removeCachedName(keyName: string) {
        for (const propertyName in this.options) {
            const currentCache = this.cache[propertyName]
            if (!currentCache) return;
            currentCache.delete(keyName)
        }
    }
}


