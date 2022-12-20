import pacote from "pacote"
import { startLoader } from "../../../utils/startLoader"
import { log } from "../../../utils/log"
import packageConfig from "../../../package.json"

export const getConfigVersions = async () => { 
    const stopLoader = startLoader("Please wait...") 
    const manifest = await pacote.manifest('kix').finally(stopLoader).catch(log.warn)
    // console.log("🚀 --> file: getConfigVersions.ts:9 --> getConfigVersions --> manifest", manifest);
    
    let kixVersion = manifest?.version
    let typescriptVersion = manifest?.dependencies?.typescript
     
    return {
        kixVersion: kixVersion || packageConfig.version,
        typescriptVersion: typescriptVersion || packageConfig.dependencies.typescript,
    }
}