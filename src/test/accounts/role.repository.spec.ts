import { RoleRepository } from '../../accounts/repositories/role.repository';

describe('RoleRepository', () => {
  it('returns an empty list without querying when ids are empty', async () => {
    const repository = Object.create(RoleRepository.prototype) as RoleRepository & {
      findByIds: jest.Mock;
    };
    repository.findByIds = jest.fn();

    const roles = await repository.findManyByIds([]);

    expect(roles).toEqual([]);
    expect(repository.findByIds).not.toHaveBeenCalled();
  });

  it('delegates role creation through save', async () => {
    const repository = Object.create(RoleRepository.prototype) as RoleRepository & {
      save: jest.Mock;
    };
    repository.save = jest.fn().mockResolvedValue({ id: 1, name: 'ADMIN' });

    const role = await repository.createOneByDTO({
      name: 'ADMIN',
      status: 1 as any,
      isUnique: false,
      assessStartAt: new Date('2025-01-01T00:00:00.000Z'),
      assessEndAt: new Date('2025-01-02T00:00:00.000Z'),
      applyCount: 10,
    });

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'ADMIN',
      applyCount: 10,
    }));
    expect(role.id).toBe(1);
  });

  it('maps getManyAndCount to items and pagination', async () => {
    const builder = {
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }, { id: 2 }], 8]),
    };
    const repository = Object.create(RoleRepository.prototype) as RoleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const roles = await repository.findManyByLimitAndOffset(2, 4);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('roles');
    expect(builder.limit).toHaveBeenCalledWith(2);
    expect(builder.offset).toHaveBeenCalledWith(4);
    expect(roles).toEqual({
      items: [{ id: 1 }, { id: 2 }],
      pagination: {
        limit: 2,
        offset: 4,
        totalCount: 8,
      },
    });
  });

  it('updates decrement and increment counters only for provided ids', async () => {
    const subBuilder = {
      update: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const addBuilder = {
      update: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const repository = Object.create(RoleRepository.prototype) as RoleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest
      .fn()
      .mockReturnValueOnce(subBuilder)
      .mockReturnValueOnce(addBuilder);

    await repository.updateManyCountByIds([3, 4], [1, 2]);

    expect(subBuilder.whereInIds).toHaveBeenCalledWith([1, 2]);
    expect(subBuilder.set).toHaveBeenCalledWith({ totalCount: expect.any(Function) });
    expect(addBuilder.whereInIds).toHaveBeenCalledWith([3, 4]);
    expect(addBuilder.set).toHaveBeenCalledWith({ totalCount: expect.any(Function) });
  });
});