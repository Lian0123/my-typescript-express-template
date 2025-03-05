import 'reflect-metadata';

import { io, Socket } from 'socket.io-client';

import { AsyncContainerModule, Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { interfaces, InversifySocketServer, TYPE } from 'inversify-socket-utils';
import pino from 'pino';

// /* Controller Layer */
import { ChattingController } from '../../chatting/chatting.socket.controller';

import '../../env';
import { Server } from "socket.io";
const { SERVICE_PORT } = process.env;

const containerBinding = new AsyncContainerModule(async (bind) => {
  bind<interfaces.Controller>(TYPE.Controller).to(ChattingController).whenTargetNamed('ChattingController');
  bind<pino.Logger>('Logger').toConstantValue(pino());
});

const clientSocket :Socket = io(`ws://localhost:${SERVICE_PORT}/v1/chatting`);
describe("my awesome project", () => {
  beforeAll(async (done) => {
    const container = new Container();
    await container.loadAsync(containerBinding);
    const server = new InversifyExpressServer(container);
    const app = server.build();
    const httpServer = app.listen(SERVICE_PORT, () => {
      console.log(`running at: ${SERVICE_PORT}`);
    });
    const serverIo = new Server(httpServer);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const socketServer = new InversifySocketServer(container, serverIo);
    socketServer.build();
  
    clientSocket.connect();

    clientSocket.on('error',(err)=>{
      console.log(err);
      done();
    });

    clientSocket.on('connect',()=>{
      console.log('socket is connected');
      done();
    });
  });

  afterAll(() => {
    clientSocket.disconnect();
  });

  test("should work", (done) => {
    expect(clientSocket?.connected).toBe(true);

    clientSocket?.on("message", (arg) => {
      expect(arg).toBe("Hello!");
      done();
    });
    clientSocket?.emit("message", "test");
  });
});