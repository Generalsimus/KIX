
import chokidar, { FSWatcher } from "chokidar";

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
    close() {
        this.watchersList.forEach(watcher => watcher.close())
    }
}
