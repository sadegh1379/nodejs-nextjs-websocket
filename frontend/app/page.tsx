"use client";

import { usePostSocketSync } from "@/socket/use-post-socket-sync";
import { useGetPostsQuery } from "@/store/slices/post-slice";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { data: posts, isLoading  } = useGetPostsQuery();

  // websocket sync
  usePostSocketSync();

  return (
    <div className="flex flex-col gap-5 text-center pt-5 bg-gray-800">
      <h1 className="text-3xl font-bold text-white">WebSocket Demo</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {isLoading ? (
        <div className="col-span-full text-center">Loading posts...</div>
      ) : (
        posts?.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded shadow hover:shadow-md transition-shadow bg-gray-300"
          >
            <h3 className="font-medium text-gray-800 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.body}</p>
            <div className="mt-2 text-xs text-gray-500">
              <span>User: {post.userId}</span>
              <span className="ml-2">Post: {post.id}</span>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
}
