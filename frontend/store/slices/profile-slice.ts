"use client"
import { SOCKET_TYPE } from '@/socket/socket-type-enum';
import { closeWebSocket, getWebSocket } from '@/socket/socketManager';
import { messageEventData } from '@/socket/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
   id: number;
   name: string;
   username: string;
   email: string;
   phone: string,
}

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (build) => ({
    getUserProfile: build.query<User, void>({
      query: () => `users/1`,
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
            ) as messageEventData<User>;

            if (message.type === SOCKET_TYPE.USER_PROFILE) {
              console.log("user profile socket data => ", message.data);
              updateCachedData((draft) => {
                Object.assign(draft, message.data);
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
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserProfileQuery } = userApi