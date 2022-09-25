/* Import Package */
import pino from 'pino';
import { Connection } from 'amqplib';

/* Define Utils */
import { createRabbitMQEvent, listenRabbitMQEvent } from '../utils/rabbit-mq';

/* Type Define */
import { AccountPO } from './po/account.po';

/* Enum & Constant */
import { CREATED_ACCOUNT_EVENT } from './constants/account.constant';

const logger = pino();

export const createAccountEvent = async (connection: Connection, accountData: AccountPO) => {
    await createRabbitMQEvent(connection, CREATED_ACCOUNT_EVENT, accountData);
};

export const listenAccountEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, CREATED_ACCOUNT_EVENT, listenAccountEventHandler);
    
};

export const listenAccountEventHandler = async (accountData: AccountPO) :Promise<void> => {
    if(!accountData){
        logger.info(`rabbitMQ "${CREATED_ACCOUNT_EVENT}" not have content`);
        return;
    }
    logger.info(`rabbitMQ "${CREATED_ACCOUNT_EVENT}" get account "${accountData.id}"`);
    logger.info(accountData);
};

// TODO add heartbeat & ack 