/* Import Package */
import pino from 'pino';
import { Connection } from 'amqplib';

/* Define Utils */
import { bufferToObject, objectToBuffer } from './util';

const logger = pino();

/**
 * Create RabbitMQ Event Utils, it will bind in container.ts
 * @param connection 
 * @param eventName 
 * @param data 
 */
export const createRabbitMQEvent = async (connection: Connection, eventName: string, data: any) => {
    const channel = await connection.createChannel();
    
    channel.assertQueue(eventName,{
        durable: true
    });
    channel.sendToQueue(eventName, objectToBuffer(data),{
        persistent: true
    });
    logger.info(`rabbitMQ send ${eventName} is successful`);

};

type EventHandler  = (data:any) => Promise<void>

/**
 * Create RabbitMQ Event Utils, it will bind in container.ts
 * @param connection 
 * @param eventName 
 * @param data 
 */
export const listenRabbitMQEvent = async (connection: Connection, eventName: string, eventHandler: EventHandler) => {
    const channel = await connection.createChannel();
    
    channel.assertQueue(eventName,{
        durable: true
    });

    channel.consume(eventName, ( msg ) => {
        const content = bufferToObject(msg.content);
        eventHandler(content).then( () => {
            logger.info(`rabbitMQ process ${eventName} is successful`);
            logger.info(content);
        });
        channel.ack(msg,false);
    });

};