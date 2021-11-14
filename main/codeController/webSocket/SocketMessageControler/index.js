import { ALERT_ERROR } from "./ALERT_ERROR";

export const SocketControlerFunctions = {
    RESTART_SERVER: (data) => {
        window.location.reload();
    },
    ALERT_ERROR: ALERT_ERROR
}


export const listenSocketMessages = (event) => {
    try {
        const { action, data } = JSON.parse(event.data)
        SocketControlerFunctions[action](data)
    } catch (e) { }
}
