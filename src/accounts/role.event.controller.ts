/* Import Package */
import pino from 'pino';
import { Connection } from 'amqplib';

/* Define Utils */
import { createRabbitMQEvent, listenRabbitMQEvent } from '../utils/rabbit-mq';

/* Type Define */
import { RoleRabbitMQAO } from './ao/role.ao';
import { RolePO } from './po/role.po';

/* Enum & Constant */
import { 
    CREATED_ROLE_EVENT,
    UPDATED_ROLE_EVENT,
 } from './constants/account.constant';

const logger = pino();

/**
 * Send Event
 */
export const createRoleEvent = async (connection: Connection, roleData: RolePO) => {
    await createRabbitMQEvent(connection, CREATED_ROLE_EVENT, RoleRabbitMQAO.plainToClass(roleData));
};

export const updateRoleEvent = async (connection: Connection, roleData: RolePO) => {
    await createRabbitMQEvent(connection, UPDATED_ROLE_EVENT, RoleRabbitMQAO.plainToClass(roleData));
};

/**
 * Listen Event
 */
export const listenRoleCreatedEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, CREATED_ROLE_EVENT, listenRoleCreatedEventHandler);
};

export const listenRoleCreatedEventHandler = async (roleData: RolePO) :Promise<void> => {
    if(!roleData){
        logger.info(`rabbitMQ "${CREATED_ROLE_EVENT}" not have content`);
        return;
    }
    logger.info(`rabbitMQ "${CREATED_ROLE_EVENT}" get role "${roleData?.id}"`);
    logger.info(roleData);
};


export const listenRoleUpdatedEvent = async (connection: Connection) => {
    await listenRabbitMQEvent(connection, UPDATED_ROLE_EVENT, listenRoleUpdatedEventHandler);
};

export const listenRoleUpdatedEventHandler = async (roleData: RolePO) :Promise<void> => {
    if(!roleData){
        logger.info(`rabbitMQ "${UPDATED_ROLE_EVENT}" not have content`);
        return;
    }
    logger.info(`rabbitMQ "${UPDATED_ROLE_EVENT}" get role "${roleData?.id}"`);
    logger.info(roleData);
};