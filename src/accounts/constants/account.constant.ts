// Table Name
export const ACCOUNTS_TABLE = 'accounts';
export const ROLES_TABLE = 'roles';

// AMQP Event Name 
export const CREATED_ACCOUNT_EVENT = 'AccountCreated';
export const UPDATED_ACCOUNT_EVENT = 'AccountUpdated';
export const CREATED_ROLE_EVENT = 'RoleCreated';
export const UPDATED_ROLE_EVENT = 'RoleUpdated';

// AMQP Event Name (for test) 
export const TEST_CREATED_ACCOUNT_EVENT = `Test${CREATED_ACCOUNT_EVENT}`;
export const TEST_UPDATED_ACCOUNT_EVENT = `Test${UPDATED_ACCOUNT_EVENT}`;
export const TEST_CREATED_ROLE_EVENT = `Test${CREATED_ROLE_EVENT}`;
export const TEST_UPDATED_ROLE_EVENT = `Test${UPDATED_ROLE_EVENT}`;