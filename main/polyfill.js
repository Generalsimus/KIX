import kix from "kix"

/* async importer */
exports.A = (urlPath, ...moduleLocations) => {
    const getModule = () => {
        let module = window;
        for (const key of moduleLocations) {
            module = (module || {})[key]
        }
        return module
    }
    return new Promise((resolve, reject) => {
        const module = getModule()
        module ? resolve(module) : kix(document.head, {
            script: null,
            src: urlPath,
            e: {
                load: () => {
                    const module = getModule()
                    module ? resolve(module) : reject(module)
                }
            }
        })
    })
} 