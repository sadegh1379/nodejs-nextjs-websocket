"use client"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
    userId: string;
    id: number;
    title: string;
    body: string;
}

// Define a service using a base URL and expected endpoints
export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => `posts?_limit=10`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsQuery } = postApi