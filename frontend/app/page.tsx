"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [message, setMessage] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxYWUwNjhhYzEzZjZjY2Y5MzBlMjkiLCJpYXQiOjE3NDcwMzg4MTAsImV4cCI6MTc0NzY0MzYxMH0.x4TBQZoFtD_iEw-nSuf-s4rwpWn08PGBSz53OwDK848"); // replace with your WebSocket URL

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data) as { type: string; userId: string; data: any };
      console.log("Received data:", data);
      setMessage(data.data)
      // You can dispatch Redux updates here
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);


  return (
    <div className="flex flex-col gap-5 items-center justify-center h-[100vh]">
      <h1>websocket</h1>
     
      <h2>socket message: {message}</h2>
    </div>
  );
}
