import { getMockReq } from '@jest-mock/express';

jest.mock('typeorm-transactional-cls-hooked', () => ({
  ...jest.requireActual('typeorm-transactional-cls-hooked'),
  Transactional: () => () => undefined,
}));

/* Controller Layer */
import { V1AccountController } from '../../accounts/account.controller';
import { AccountStatusEnum, GenderEnum } from '../../common/enums';

describe('V1AccountController', () => {
  it('maps params through validation and returns an exposed account object', async () => {
    const accountService = {
      findOneAccountById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'josh',
        gender: 'MALE',
        email: 'example@mail.com',
        language: 'Japanese',
        area: 'Asia',
        country: 'Japan',
        roles: [1, 2, 3],
      }),
    } as any;
    const v1AccountController = new V1AccountController(accountService);

    const request = getMockReq({
      params: {
        id: '1'
      }
    });

    const account = await v1AccountController.findAccountById(request);

    expect(accountService.findOneAccountById).toHaveBeenCalledWith(1);
    expect(account?.name).toBe('josh');
    expect((account as any).id).toBe(1);
  });

  it('creates one account and exposes the response payload', async () => {
    const accountService = {
      createOneAccountByDTO: jest.fn().mockResolvedValue({
        id: 2,
        name: 'amy',
        gender: GenderEnum.FEMALE,
        email: 'amy@example.com',
        language: 'English',
        area: 'Asia',
        country: 'Taiwan',
        roles: [1],
      }),
    } as any;
    const controller = new V1AccountController(accountService);

    const request = getMockReq({
      body: {
        name: 'amy',
        gender: GenderEnum.FEMALE,
        email: 'amy@example.com',
        language: 'English',
        area: 'Asia',
        country: 'Taiwan',
        status: AccountStatusEnum.ENABLE,
      },
    });

    const account = await controller.createAccountByDTO(request);

    expect(accountService.createOneAccountByDTO).toHaveBeenCalledWith(expect.objectContaining({
      name: 'amy',
      gender: GenderEnum.FEMALE,
      email: 'amy@example.com',
    }));
    expect(account.id).toBe(2);
  });

  it('updates one account with merged params and body values', async () => {
    const accountService = {
      updateOneAccountById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const controller = new V1AccountController(accountService);

    const request = getMockReq({
      params: { id: '5' },
      body: {
        name: 'new-name',
        status: AccountStatusEnum.BLOCKED,
      },
    });

    await controller.updateAccountById(request);

    expect(accountService.updateOneAccountById).toHaveBeenCalledWith(expect.objectContaining({
      id: 5,
      name: 'new-name',
      status: AccountStatusEnum.BLOCKED,
    }));
  });

  it('deletes one account after validating the route param', async () => {
    const accountService = {
      deleteOneAccountById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const controller = new V1AccountController(accountService);

    const request = getMockReq({
      params: { id: '9' },
    });

    await controller.deleteAccountById(request);

    expect(accountService.deleteOneAccountById).toHaveBeenCalledWith(9);
  });

  it('returns paginated accounts with numeric query values', async () => {
    const accountService = {
      findManyAccountByLimitAndOffset: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            name: 'josh',
            gender: GenderEnum.MALE,
            email: 'example@mail.com',
            language: 'Japanese',
            area: 'Asia',
            country: 'Japan',
            roles: [1, 2, 3],
          },
        ],
        pagination: {
          limit: 20,
          offset: 40,
          totalCount: 1,
        },
      }),
    } as any;
    const controller = new V1AccountController(accountService);

    const request = getMockReq({
      query: {
        limit: '20',
        offset: '40',
      },
    });

    const accounts = await controller.findAccountsByDTO(request);

    expect(accountService.findManyAccountByLimitAndOffset).toHaveBeenCalledWith(20, 40);
    expect(accounts.items[0].id).toBe(1);
  });

  it('deduplicates roles before updating account roles', async () => {
    const accountService = {
      updateAccountRoleByDTO: jest.fn().mockResolvedValue(undefined),
    } as any;
    const controller = new V1AccountController(accountService);

    const request = getMockReq({
      params: { id: '7' },
      body: {
        roles: [1, 1, 2],
      },
    });

    await controller.updateAccountRoleByDTO(request);

    expect(accountService.updateAccountRoleByDTO).toHaveBeenCalledWith(expect.objectContaining({
      id: 7,
      roles: [1, 2],
    }));
  });
});
