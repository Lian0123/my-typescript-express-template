import { getMockReq } from '@jest-mock/express';

/* Controller Layer */
import { V1AccountController } from '../../accounts/account.controller';

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
});
