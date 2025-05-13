// usePostSocketSync.ts
import { Post, postApi } from '@/store/slices/post-slice';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { messageEventData } from './types';
import { SOCKET_TYPE } from './socket-type-enum';
import { AppDispatch } from '@/store/store';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxYWUwNjhhYzEzZjZjY2Y5MzBlMjkiLCJpYXQiOjE3NDcxMjE3MjEsImV4cCI6MTc0NzcyNjUyMX0.b4hWOCgP_PscXlctyVTG5zDAYaj1I9bw-PfpY2hO7kM"

export const usePostSocketSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:5000?token=${TOKEN}`);

    socketRef.current.onopen = () => {
      console.log("Posts WebSocket connected");
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data as string) as messageEventData<Post>

      if(message.type === SOCKET_TYPE.POST){
        dispatch(postApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const index = draft.findIndex(post => post.id === message.data.id);
            if(index !== -1){
                draft[index] = message.data;
            }
        }))
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [dispatch]);
};
