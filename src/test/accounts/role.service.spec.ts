import { V1RoleService } from '../../accounts/role.service';
import { createRoleEvent, updateRoleEvent } from '../../accounts/role.event.controller';
import { RoleStatusEnum } from '../../common/enums';

jest.mock('../../accounts/role.event.controller', () => ({
  createRoleEvent: jest.fn(),
  updateRoleEvent: jest.fn(),
}));

describe('V1RoleService', () => {
  it('creates one role and emits a creation event', async () => {
    const roleRepository = {
      createOneByDTO: jest.fn().mockResolvedValue({ id: 1, name: 'ADMIN' }),
    } as any;
    const service = new V1RoleService(roleRepository, {} as any);

    const role = await service.createOneRoleByDTO({
      name: 'ADMIN',
      status: RoleStatusEnum.ENABLE,
      isUnique: false,
      applyCount: 1,
    });

    expect(roleRepository.createOneByDTO).toHaveBeenCalled();
    expect(createRoleEvent).toHaveBeenCalled();
    expect(role.id).toBe(1);
  });

  it('updates one role and emits an update event', async () => {
    const roleRepository = {
      updateOneByDTO: jest.fn().mockResolvedValue({ id: 2, name: 'ADMIN' }),
    } as any;
    const service = new V1RoleService(roleRepository, {} as any);

    const role = await service.updateOneRoleById({
      id: 2,
      name: 'ADMIN',
    });

    expect(roleRepository.updateOneByDTO).toHaveBeenCalledWith({
      id: 2,
      name: 'ADMIN',
    });
    expect(updateRoleEvent).toHaveBeenCalled();
    expect(role.id).toBe(2);
  });

  it('deletes one role through the repository', async () => {
    const roleRepository = {
      deleteOneById: jest.fn().mockResolvedValue(undefined),
    } as any;
    const service = new V1RoleService(roleRepository, {} as any);

    await service.deleteOneRoleById(3);

    expect(roleRepository.deleteOneById).toHaveBeenCalledWith(3);
  });

  it('lists roles through the repository', async () => {
    const roleRepository = {
      findManyByLimitAndOffset: jest.fn().mockResolvedValue({
        items: [{ id: 1, name: 'ADMIN' }],
        pagination: { limit: 10, offset: 0, totalCount: 1 },
      }),
    } as any;
    const service = new V1RoleService(roleRepository, {} as any);

    const roles = await service.findManyRoleByLimitAndOffset(10, 0);

    expect(roleRepository.findManyByLimitAndOffset).toHaveBeenCalledWith(10, 0);
    expect(roles.items[0].id).toBe(1);
  });
});
