import { SOCKET_TYPE } from "./socket-type-enum";

interface socketWssSend<T> {
    type: SOCKET_TYPE; userId: string; data: T
}

export type {socketWssSend}