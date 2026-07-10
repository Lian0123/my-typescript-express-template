import { AccountRepository } from '../../accounts/repositories/account.repository';
import { GenderEnum, AccountStatusEnum } from '../../common/enums';

describe('AccountRepository', () => {
  it('returns one account by id', async () => {
    const repository = Object.create(AccountRepository.prototype) as AccountRepository & {
      findOne: jest.Mock;
    };
    repository.findOne = jest.fn().mockResolvedValue({ id: 1, name: 'josh' });

    const account = await repository.findOneById(1);

    expect(repository.findOne).toHaveBeenCalledWith({ id: 1 });
    expect(account.id).toBe(1);
  });

  it('creates one account through save', async () => {
    const repository = Object.create(AccountRepository.prototype) as AccountRepository & {
      save: jest.Mock;
    };
    repository.save = jest.fn().mockResolvedValue({ id: 1, name: 'josh' });

    const account = await repository.createOneByDTO({
      name: 'josh',
      gender: GenderEnum.MALE,
      email: 'example@mail.com',
      area: 'Asia',
      language: 'Japanese',
      country: 'Japan',
      status: AccountStatusEnum.ENABLE,
    });

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'josh',
      status: AccountStatusEnum.ENABLE,
    }));
    expect(account.id).toBe(1);
  });

  it('updates one account through query builder', async () => {
    const builder = {
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ raw: [{ id: 1, name: 'updated' }] }),
    };
    const repository = Object.create(AccountRepository.prototype) as AccountRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const account = await repository.updateOneByDTO({
      id: 1,
      name: 'updated',
    });

    expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'updated' }));
    expect(account.name).toBe('updated');
  });

  it('soft deletes one account by updating isDeleted', async () => {
    const repository = Object.create(AccountRepository.prototype) as AccountRepository & {
      update: jest.Mock;
    };
    repository.update = jest.fn().mockResolvedValue(undefined);

    await repository.deleteOneById(5);

    expect(repository.update).toHaveBeenCalledWith({ id: 5 }, { isDeleted: true });
  });

  it('returns paginated accounts by limit and offset', async () => {
    const builder = {
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([
        [{ id: 1 }, { id: 2 }],
        2,
      ]),
    };
    const repository = Object.create(AccountRepository.prototype) as AccountRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const accounts = await repository.findManyByLimitAndOffset(2, 0);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('accounts');
    expect(builder.limit).toHaveBeenCalledWith(2);
    expect(accounts.pagination.totalCount).toBe(2);
  });
});
