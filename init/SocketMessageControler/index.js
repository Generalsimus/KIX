import { ERROR_CODE } from './ERROR_CODE';
import { sendFileDiagnostics } from './utils';

export const SocketControlerFunctions = {
    ERROR_CODE
}

export const listenSocketMessages = (ws, socketClientSender) => {


    ws.on('connection', function (connectedWs) {
        sendFileDiagnostics(connectedWs, socketClientSender)
        connectedWs.on('message', (message) => {
            try {
                const { action, data } = JSON.parse(message)
                SocketControlerFunctions[action](data, socketClientSender)
            } catch (error) {
                console.log({ error })
            }

        });
    })


}
