import { V1AccountService } from '../../accounts/account.service';
import { RoleStatusEnum } from '../../common/enums';
import { ErrorMessageEnum } from '../../common/constants';

import { createAccountEvent, updateAccountEvent } from '../../accounts/account.event.controller';

jest.mock('../../accounts/account.event.controller', () => ({
  createAccountEvent: jest.fn(),
  updateAccountEvent: jest.fn(),
}));

describe('V1AccountService', () => {
  it('finds one account by id through the injected repository', async () => {
    const accountRepository = {
      findOneById: jest.fn().mockResolvedValue({ id: 1, name: 'josh' }),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    const account = await accountService.findOneAccountById(1);

    expect(accountRepository.findOneById).toHaveBeenCalledWith(1);
    expect(account.name).toBe('josh');
  });

  it('creates one account and emits a creation event', async () => {
    const accountRepository = {
      createOneByDTO: jest.fn().mockResolvedValue({ id: 2, name: 'amy' }),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    const account = await accountService.createOneAccountByDTO({
      name: 'amy',
      gender: 'FEMALE' as any,
      email: 'amy@example.com',
      area: 'Asia',
      language: 'English',
      country: 'Taiwan',
      status: 1 as any,
    });

    expect(accountRepository.createOneByDTO).toHaveBeenCalled();
    expect(createAccountEvent).toHaveBeenCalled();
    expect(account.id).toBe(2);
  });

  it('updates one account and emits an update event', async () => {
    const accountRepository = {
      updateOneByDTO: jest.fn().mockResolvedValue({ id: 3, name: 'updated' }),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    const account = await accountService.updateOneAccountById({
      id: 3,
      name: 'updated',
    });

    expect(accountRepository.updateOneByDTO).toHaveBeenCalledWith({
      id: 3,
      name: 'updated',
    });
    expect(updateAccountEvent).toHaveBeenCalled();
    expect(account.id).toBe(3);
  });

  it('deletes one account through the repository', async () => {
    const accountRepository = {
      deleteOneById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    await accountService.deleteOneAccountById(4);

    expect(accountRepository.deleteOneById).toHaveBeenCalledWith(4);
  });

  it('lists accounts through the repository', async () => {
    const accountRepository = {
      findManyByLimitAndOffset: jest.fn().mockResolvedValue({
        items: [{ id: 1, name: 'josh' }],
        pagination: { limit: 10, offset: 0, totalCount: 1 },
      }),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    const accounts = await accountService.findManyAccountByLimitAndOffset(10, 0);

    expect(accountRepository.findManyByLimitAndOffset).toHaveBeenCalledWith(10, 0);
    expect(accounts.items[0].id).toBe(1);
  });

  it('updates account roles and adjusts role counters', async () => {
    const accountRepository = {
      findOneById: jest.fn().mockResolvedValue({ id: 1, roles: [1] }),
      updateOneByDTO: jest.fn().mockResolvedValue({ id: 1, roles: [2] }),
    } as any;
    const roleRepository = {
      findManyByIds: jest
        .fn()
        .mockResolvedValueOnce([{ id: 1, isUnique: false, status: RoleStatusEnum.ENABLE }])
        .mockResolvedValueOnce([{ id: 2, isUnique: false, status: RoleStatusEnum.ENABLE }]),
      updateManyCountByIds: jest.fn().mockResolvedValue(undefined),
    } as any;
    const accountService = new V1AccountService(accountRepository, roleRepository, {} as any);

    await accountService.updateAccountRoleByDTO({ id: 1, roles: [2] });

    expect(accountRepository.updateOneByDTO).toHaveBeenCalledWith({ id: 1, roles: [2] });
    expect(roleRepository.updateManyCountByIds).toHaveBeenCalledWith([2], [1]);
  });

  it('rejects unknown account ids when updating roles', async () => {
    const accountRepository = {
      findOneById: jest.fn().mockResolvedValue(null),
    } as any;
    const accountService = new V1AccountService(accountRepository, {} as any, {} as any);

    await expect(accountService.updateAccountRoleByDTO({ id: 999, roles: [1] })).rejects.toMatchObject({
      errorType: ErrorMessageEnum.TEMPLATE_ACCOUNT_DATA_NOT_FOUND,
    });
  });

  it('rejects roles that do not exist', async () => {
    const accountRepository = {
      findOneById: jest.fn().mockResolvedValue({ id: 1, roles: [] }),
    } as any;
    const roleRepository = {
      findManyByIds: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 1, isUnique: false, status: RoleStatusEnum.ENABLE }]),
    } as any;
    const accountService = new V1AccountService(accountRepository, roleRepository, {} as any);

    await expect(accountService.updateAccountRoleByDTO({ id: 1, roles: [1, 2] })).rejects.toMatchObject({
      errorType: ErrorMessageEnum.TEMPLATE_ROLE_NO_EXIST,
    });
  });

  it('rejects multiple unique roles in the same update', async () => {
    const accountRepository = {
      findOneById: jest.fn().mockResolvedValue({ id: 1, roles: [] }),
    } as any;
    const roleRepository = {
      findManyByIds: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { id: 1, isUnique: true, status: RoleStatusEnum.ENABLE },
          { id: 2, isUnique: true, status: RoleStatusEnum.ENABLE },
        ]),
    } as any;
    const accountService = new V1AccountService(accountRepository, roleRepository, {} as any);

    try {
      await accountService.updateAccountRoleByDTO({ id: 1, roles: [1, 2] });
      fail('expected updateAccountRoleByDTO to throw');
    } catch (error: any) {
      expect(error.errorType).toBe('TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE');
    }
  });
});
