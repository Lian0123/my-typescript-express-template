import { getMockReq } from '@jest-mock/express';

import { V1RoleController } from '../../accounts/role.controller';
import { RoleStatusEnum } from '../../common/enums';

describe('V1RoleController', () => {
  it('deletes one role after validating the route param', async () => {
    const roleService = {
      deleteOneRoleById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const roleController = new V1RoleController(roleService);

    const request = getMockReq({
      params: { id: '11' },
    });

    await roleController.deleteRoleById(request);

    expect(roleService.deleteOneRoleById).toHaveBeenCalledWith(11);
  });

  it('merges params and body when updating a role', async () => {
    const roleService = {
      updateOneRoleById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const roleController = new V1RoleController(roleService);

    const request = getMockReq({
      params: { id: '3' },
      body: {
        status: RoleStatusEnum.DISABLE,
        applyCount: 5,
      },
    });

    await roleController.updateRoleById(request);

    expect(roleService.updateOneRoleById).toHaveBeenCalledWith(expect.objectContaining({
      id: 3,
      status: RoleStatusEnum.DISABLE,
      applyCount: 5,
    }));
  });

  it('returns an exposed role AO for a role id lookup', async () => {
    const roleService = {
      findOneRoleById: jest.fn().mockResolvedValue({
        id: 7,
        name: 'ADMIN',
        status: RoleStatusEnum.ENABLE,
        isUnique: false,
        assessStartAt: '2025-01-01T00:00:00.000Z',
        assessEndAt: '2025-01-03T00:00:00.000Z',
        applyCount: 30,
        totalCount: 2,
      }),
    } as any;
    const roleController = new V1RoleController(roleService);

    const request = getMockReq({
      params: { id: '7' },
    });

    const role = await roleController.findRoleById(request);

    expect(roleService.findOneRoleById).toHaveBeenCalledWith(7);
    expect(role.id).toBe(7);
    expect(role.totalCount).toBe(2);
  });

  it('passes validated pagination values to the list query', async () => {
    const roleService = {
      findManyRoleByLimitAndOffset: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            name: 'ADMIN',
            status: RoleStatusEnum.ENABLE,
            isUnique: false,
            assessStartAt: '2025-01-01T00:00:00.000Z',
            assessEndAt: '2025-01-03T00:00:00.000Z',
            applyCount: 10,
            totalCount: 1,
          },
        ],
        pagination: {
          limit: 20,
          offset: 40,
          totalCount: 1,
        },
      }),
    } as any;
    const roleController = new V1RoleController(roleService);

    const request = getMockReq({
      query: {
        limit: '20',
        offset: '40',
      },
    });

    const roles = await roleController.findRolesByDTO(request);

    expect(roleService.findManyRoleByLimitAndOffset).toHaveBeenCalledWith(20, 40);
    expect(roles.pagination.totalCount).toBe(1);
    expect(roles.items[0].id).toBe(1);
  });
});