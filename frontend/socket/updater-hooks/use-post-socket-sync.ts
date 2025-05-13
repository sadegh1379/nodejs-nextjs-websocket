import { Post, postApi } from "@/store/slices/post-slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SOCKET_TYPE } from "../socket-type-enum";
import { getWebSocket, closeWebSocket } from "../socketManager";
import { messageEventData } from "../types";

export const usePostSocketSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = getWebSocket();
    
    socket.onopen = () => {
      console.log("Posts WebSocket connected");
    };

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(
        event.data as string
      ) as messageEventData<Post>;

      if (message.type === SOCKET_TYPE.POST) {
        console.log('post socket data => ', message.data)
        dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const index = draft.findIndex(
              (post) => post.id === message.data.id
            );
            if (index !== -1) {
              draft[index] = message.data;
            }
          })
        );
      }
    };

    socket.onerror = (error) => {
      console.error("Post WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Post WebSocket disconnected");
    };

    return () => {
      closeWebSocket();
    };
  }, [dispatch]);
};
