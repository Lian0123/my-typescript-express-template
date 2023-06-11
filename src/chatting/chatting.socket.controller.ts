import pino from 'pino';
import {
  connectedSocket,
  controller,
  onConnect, 
  onDisconnect,
  onMessage,
  payload,
} from "inversify-socket-utils";
import { injectable } from "inversify";

import "reflect-metadata";

const logger = pino();

@injectable()
@controller("/v1/chatting")
export class ChattingController {
    @onConnect("connection")
    connection() {
      logger.info("chatting client connected");
    }
  
    @onDisconnect("disconnect")
    disconnect() {
      logger.info("chatting client disconnected");
    }
  
    @onMessage("message")
    message(@payload() payloadData: any, @connectedSocket() socket: any) {
      logger.info(`payload: ${JSON.stringify(payloadData)}`);
      socket.emit("message", "Hello!");
    }
}