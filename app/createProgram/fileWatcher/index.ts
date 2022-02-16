
import chokidar, { FSWatcher } from "chokidar";
import path from "node:path/win32";

type eventNameType = 'all' | 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir' | 'error' | 'ready'
type AddWatcherType = { event?: eventNameType, filePath?: string, callBack?: (eventName: eventNameType, filePath: string) => void }

export class FileWatcher {
    watchersList: FSWatcher[] = []
    createWatcher({ event = 'all', filePath, callBack, }: AddWatcherType) {
        const watcher = new FSWatcher({ ignoreInitial: true })
        filePath && watcher.add(filePath)
        callBack && watcher.on(event, callBack)
        this.watchersList.push(watcher)
        return watcher
    }
    createSingleFileCallbackWatcher(event: eventNameType = 'all') {
        const watchMap = new Map<string, Function>()
        const watcher = new FSWatcher({ ignoreInitial: true })
        this.watchersList.push(watcher)
        watcher.on(event, (eventName: eventNameType, filePath: string) => {
            const callbackFunc = watchMap.get(path.resolve(filePath))
            if (callbackFunc) {
                callbackFunc(eventName, filePath)
            }
        })

        return {
            addFile(fileName: string, callBack: (eventName: eventNameType, filePath: string) => void) {
                watcher.add(path.resolve(fileName))
                watchMap.set(path.resolve(fileName), callBack)
            },
            unWatchFile(fileName: string) {
                fileName = path.resolve(fileName)
                watcher.unwatch(fileName)
                watchMap.delete(fileName)
            }
        }
    }
    close() {
        this.watchersList.forEach(watcher => watcher.close())
    }
}
