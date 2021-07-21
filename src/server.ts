import express, { Application } from "express";
import cors from "cors";

import fs from "fs";
import path from "path";

import { Server as SocketIOServer, Socket } from "socket.io";
import { createServer, Server as HTTPServer } from "https";

export class Server {
  private _httpServer: HTTPServer;
  private _app: Application;
  private _io: SocketIOServer;

  private _clients = new Map<string, Socket>();

  private readonly DEFAULT_PORT = 4444;

  constructor() {
    this._init();
    this._initRoutes();
    this._initSocketHandler();
  }

  private _init(): void {
    this._app = express();
    this._app.use(cors());

    this._httpServer = createServer({
      key: fs.readFileSync(process.env.PRIVKEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH)
    }, this._app);

    this._io = new SocketIOServer().listen(this._httpServer, {
      cors: {
        origin: "*",
      }
    });
  }

  private _initRoutes(): void {
    this._app.get("/", (req, res) => {
      res.send("ok");
    });

    this._app.get("/users", (req, res) => {
      res.json([...this._clients.keys()]);
    });

    this._app.use("/static", express.static(path.join(__dirname, "static", "public")));
  }

  private _emitAllUsers(socket: Socket, name: string, data: any, emitSelf: boolean = false): void {
    [...this._clients.entries()].forEach(([id, client]) => {
      if (client.id !== socket.id || client.id === socket.id && emitSelf === true) {
        client.emit(name, data);
      }
    });
  }

  private _initSocketHandler(): void {
    this._io.on("connection", (socket) => {
      console.log(`client ${socket.id} connected`);
      this._clients.set(socket.id, socket);

      this._emitAllUsers(socket, "user_join", { id: socket.id }, true);

      socket.on("radio", ({ blob, sampleRate }) => {
        this._emitAllUsers(socket, "voice", { id: socket.id, blob, sampleRate });
        this._emitAllUsers(socket, "user_speak", { id: socket.id }, true);
      });

      socket.on("audio_sticker", ({ sticker }) => {
        console.log("audio sticker", sticker);
        this._emitAllUsers(socket, "audio_sticker", { sticker }, true);
      });

      socket.on("disconnect", () => {
        console.log(`client ${socket.id} disconnected`);
        this._clients.delete(socket.id);
        this._emitAllUsers(socket, "user_leave", { id: socket.id }, true);
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this._httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
