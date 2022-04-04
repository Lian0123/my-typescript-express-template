import { Connection } from 'amqplib'
import { createRabbitMQEvent, listenRabbitMQEvent } from '../util/rabbbitmq';
import { CREATED_USER_EVENT } from './constants/user.constant';
import { UserPO } from './po/user.po';

export const createUserEvent = async (connection: Connection, userData: UserPO) => {
    await createRabbitMQEvent(connection, CREATED_USER_EVENT, userData);
}

export const listenUserEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, CREATED_USER_EVENT, listenUserEventHandler);
    
}

export const listenUserEventHandler = async (userData: UserPO) :Promise<void> => {
    if(!userData){
        console.log(`rabbitMQ "${CREATED_USER_EVENT}" not have content`);
        return
    }
    console.log(`rabbitMQ "${CREATED_USER_EVENT}" get user "${userData.id}"`);
    console.log(userData);
}

// TODO add heartbeat