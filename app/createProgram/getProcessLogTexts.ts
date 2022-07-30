import { App } from ".."

export const getProcessLogTexts = () => {
    if (App.devMode) {
        return {
            start: "Starting compilation in watch mode...",
            end: "Watching for file changes."
        }
    }
    return {
        start: "The building process has started...",
        end: "Files compiled successfully. Wait for the process to finish..."
    }
}