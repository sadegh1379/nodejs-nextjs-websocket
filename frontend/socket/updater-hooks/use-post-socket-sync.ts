import { Post, postApi } from "@/store/slices/post-slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SOCKET_TYPE } from "../socket-type-enum";
import { getWebSocket } from "../socketManager";
import { messageEventData } from "../types";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxYWUwNjhhYzEzZjZjY2Y5MzBlMjkiLCJpYXQiOjE3NDcxMjE3MjEsImV4cCI6MTc0NzcyNjUyMX0.b4hWOCgP_PscXlctyVTG5zDAYaj1I9bw-PfpY2hO7kM";

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
      socket?.close();
    };
  }, [dispatch]);
};
