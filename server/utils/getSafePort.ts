import prompts from "prompts";
import tcpPortUsed from "tcp-port-used";

export const getSafePort = async (port: number) => {
    const ifPortIsTaken = await tcpPortUsed.check(port);
    if (ifPortIsTaken) {
        const { ifNeedNewPort } = await prompts({
            type: 'confirm',
            name: 'ifNeedNewPort',
            message: `Something is already running on port ${port}.\nWould you like to run the app on another port instead?`,
            initial: true
        })
        if (ifNeedNewPort) {
            port = await getNoTakenPort(port)
        } else {
            process.exit(1);
        }
    }
    return port;
}

const getNoTakenPort = async (port: number): Promise<number> => {
    const ifPortIsTaken = await tcpPortUsed.check(port);
    if (ifPortIsTaken) {
        return getNoTakenPort(++port);
    }
    return port;
}