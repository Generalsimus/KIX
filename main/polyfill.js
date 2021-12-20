import kix from "kix"

/* async importer */
exports.A = (urlPath, module) => new Promise((resolve, reject) => {
    module ? resolve(module) : kix(document.head, {
        script: null,
        src: urlPath,
        e: {
            load: () => resolve(module)
        }
    })
}) 