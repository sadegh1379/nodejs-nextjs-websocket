"use client"
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
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserProfileQuery } = userApi