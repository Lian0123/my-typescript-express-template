import { V1AccountService } from '../../accounts/account.service';
import { RoleStatusEnum } from '../../common/enums';

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
