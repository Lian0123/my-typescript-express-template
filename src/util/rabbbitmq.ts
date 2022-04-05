import { Connection } from 'amqplib'
import { bufferToObject, objectToBuffer } from './util';
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
    console.log(`rabbitMQ send ${eventName} is successful`);

}

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
            // TODO console.log for debug
            console.log(`rabbitMQ process ${eventName} is successful`);
            console.log(content);
        });
        channel.ack(msg,false);
    });

}