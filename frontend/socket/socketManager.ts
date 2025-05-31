let socket: WebSocket | null = null;

// TODO: dynamic this token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxYWUwNjhhYzEzZjZjY2Y5MzBlMjkiLCJpYXQiOjE3NDcxMjE3MjEsImV4cCI6MTc0NzcyNjUyMX0.b4hWOCgP_PscXlctyVTG5zDAYaj1I9bw-PfpY2hO7kM"

export const getWebSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
    if (socket) {
      socket.close();
    }
    socket = new WebSocket(`ws://localhost:5000?token=${TOKEN}`);
  }
  return socket;
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};