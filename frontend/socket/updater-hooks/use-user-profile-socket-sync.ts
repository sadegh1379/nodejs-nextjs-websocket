import { User, userApi } from "@/store/slices/profile-slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SOCKET_TYPE } from "../socket-type-enum";
import { getWebSocket } from "../socketManager";
import { messageEventData } from "../types";

export const useUserProfileSocketSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = getWebSocket();

    socket.onopen = () => {
      console.log("User profile WebSocket connected");
    };

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(
        event.data as string
      ) as messageEventData<User>;

      if (message.type === SOCKET_TYPE.USER_PROFILE) {
        console.log('user profile socket data => ', message.data)
        dispatch(
          userApi.util.updateQueryData("getUserProfile", undefined, (draft) => {
            Object.assign(draft, message.data);
          })
        );
      }
    };

    socket.onerror = (error) => {
      console.error("User profile WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("User profileWebSocket disconnected");
    };

    return () => {
      socket?.close();
    };
  }, [dispatch]);
};
