/* Import Package */
import pino from 'pino';
import { Connection } from 'amqplib';

/* Define Utils */
import { createRabbitMQEvent, listenRabbitMQEvent } from '../utils/rabbit-mq';

/* Type Define */
import { AccountPO } from './po/account.po';

/* Enum & Constant */
import { CREATED_ACCOUNT_EVENT, UPDATED_ACCOUNT_EVENT } from './constants/account.constant';

const logger = pino();

/**
 * Send Event
 */
export const createAccountEvent = async (connection: Connection, accountData: AccountPO) => {
    await createRabbitMQEvent(connection, CREATED_ACCOUNT_EVENT, accountData);
};

export const updateAccountEvent = async (connection: Connection, accountData: AccountPO) => {
    await createRabbitMQEvent(connection, UPDATED_ACCOUNT_EVENT, accountData);
};

/**
 * Listen Event
 */
export const listenAccountCreatedEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, CREATED_ACCOUNT_EVENT, listenAccountCreatedEventHandler);
};

export const listenAccountCreatedEventHandler = async (accountData: AccountPO) :Promise<void> => {
    if(!accountData){
        logger.info(`rabbitMQ "${CREATED_ACCOUNT_EVENT}" not have content`);
        return;
    }
    logger.info(`rabbitMQ "${CREATED_ACCOUNT_EVENT}" get account "${accountData?.id}"`);
    logger.info(accountData);
};


export const listenAccountUpdatedEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, UPDATED_ACCOUNT_EVENT, listenAccountUpdatedEventHandler);
};

export const listenAccountUpdatedEventHandler = async (accountData: AccountPO) :Promise<void> => {
    if(!accountData){
        logger.info(`rabbitMQ "${UPDATED_ACCOUNT_EVENT}" not have content`);
        return;
    }
    logger.info(`rabbitMQ "${UPDATED_ACCOUNT_EVENT}" get account "${accountData?.id}"`);
    logger.info(accountData);
};