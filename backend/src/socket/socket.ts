import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { socketWssSend } from './types';

let wss: WebSocketServer;

export const initWebSocket = (server: any) => {
  wss = new WebSocketServer({ noServer: true });

  // upgrade and set user token
  server.on("upgrade", (req: Request, socket: any, head: Headers) => {
    socket.on("error", (err: any) => console.log("socket error:", err));
    // @ts-ignore
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
      }

      (req as any).user = decoded;
    //   @ts-ignore
      wss.handleUpgrade(req, socket, head, (ws) => {
        (ws as any).userId = (decoded as any).userId;
        wss.emit("connection", ws, req);
      });
    });
  });

  // get client message
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const user = (req as any).user;
    (ws as any).userId = user.userId;

    ws.on("message", (msg, isBinary) => {
      const targetClient = [...wss.clients].find(
        (client: any) =>
          client.readyState === WebSocket.OPEN && client.userId === user.userId
      );

      if (targetClient) {
        targetClient.send(JSON.stringify({ userId: user.userId, data: msg.toString() }));
      }
    });

    ws.on("close", () => console.log("connection closed"));
  });

  return wss;
};

// send message
export const wssSend = <T>({ type, data, userId }: socketWssSend<T>): void => {
    wss.clients.forEach(client => {
      if ((client as any).userId === userId && client.readyState === 1) {
        client.send(JSON.stringify({ type, userId, data }));
      }
    });
}

export const getWSS = () => wss;
