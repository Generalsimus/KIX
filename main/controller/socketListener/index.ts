import { actionFunctions } from "./actionFunctions"

export const socketListener = (sockEvent: MessageEvent<any>) => {
    try {
        const { action, data } = JSON.parse(sockEvent.data)
        actionFunctions[action](data)
    } catch (e) { }
}