import { SOCKET_TYPE } from "./socket-type-enum"

type messageEventData<T> = {
  type: SOCKET_TYPE,
  data: T,
  userId: string;
}

export type { messageEventData }