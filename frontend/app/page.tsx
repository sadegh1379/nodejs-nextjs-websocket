"use client";

import {
  useGetPostsQuery
} from "@/store/slices/post-slice";
import { useGetUserProfileQuery } from "@/store/slices/profile-slice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const pathname = usePathname();
  const [users, setUsers] = useState<any[]>([]);

  // queries
  const { data: posts, isLoading } = useGetPostsQuery();
  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useGetUserProfileQuery();

    useEffect(() => {
      const eventSource = new EventSource('http://localhost:5000/api/users/users-stream');
  
      eventSource.onmessage = (event) => {
        const user = JSON.parse(event.data);
        setUsers((prev) => [...prev, user]);
      };
  
      eventSource.addEventListener('end', () => {
        console.log('Stream ended');
        eventSource.close();
      });
  
      eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        eventSource.close();
      };
  
      return () => {
        eventSource.close();
      };
    }, []);

  return (
    <div
      className="flex flex-col gap-5 text-center pt-5 bg-gray-800"
      key={pathname}
    >

      <h1 className="text-3xl font-bold text-white">Stream Users</h1>
      <div className="flex flex-col gap-4 p-4">
        {users.map((user, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-2 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">{user.name}</h2>
            <p className="text-gray-300">ID: {user.id}</p>
          </div>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-white">WebSocket Demo</h1>
      <Link href={"/test"}>GET TEST PAGE</Link>

      <div className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
        {isLoadingUserProfile ? (
          <div className="text-center text-white">Loading profile...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-3xl text-white">
                  {userProfile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">
                  {userProfile?.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-medium">
                  {userProfile?.username}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">
                  {userProfile?.email}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white font-medium">
                  {userProfile?.phone || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

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
