"use client";
import { SOCKET_TYPE } from "@/socket/socket-type-enum";
import { closeWebSocket, getWebSocket } from "@/socket/socketManager";
import { messageEventData } from "@/socket/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  userId: string;
  id: number;
  title: string;
  body: string;
}

// Define a service using a base URL and expected endpoints
export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => `posts?_limit=10`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = getWebSocket();

        try {
          await cacheDataLoaded;

          const listener = (event: MessageEvent) => {
            const message = JSON.parse(
              event.data as string
            ) as messageEventData<Post>;

            if (message.type === SOCKET_TYPE.POST) {
              console.log("post socket data => ", message.data);
              updateCachedData((draft) => {
                const index = draft.findIndex(
                  (post) => post.id === message.data.id
                );
                if (index !== -1) {
                  draft[index] = message.data;
                }
              });
            }
          };

          socket.addEventListener("message", listener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        await cacheEntryRemoved;
        closeWebSocket();
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsQuery } = postApi;
