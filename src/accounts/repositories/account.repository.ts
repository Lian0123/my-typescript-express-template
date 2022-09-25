/* Import Package */
import { decorate, injectable } from 'inversify';

/* Inject Member */
import { EntityRepository, Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';

/* Type Define */
import { CreateOneAccountDTO, UpdateOneAccountDTO } from '../dto/account.service.dto';
import { AccountPO, AccountsPO } from '../po/account.po';

/* Inject Reference */
import 'reflect-metadata';

decorate(injectable(), Repository);
decorate(injectable(), AccountEntity);

@injectable()
@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  async findOneById (id: number) : Promise<AccountPO> {
    return await this.findOne({ id });
  }

  async createOneByDTO (dto: CreateOneAccountDTO) : Promise<AccountPO> {
    return await this.save({ ...dto });
  }

  async updateOneByDTO (dto: UpdateOneAccountDTO) : Promise<void> {
    await this.update({ id: dto.id }, { ...dto });
  }

  async deleteOneById (id:number) : Promise<void> {
    await this.update({ id }, { isDeleted: true });
  }

  async findManyByLimitAndOffset (limit: number, offset: number) : Promise<AccountsPO> {
    const rawData = await this.createQueryBuilder('accounts').limit(limit).offset(offset).getManyAndCount();
    return {
      items: rawData[0],
      pagination: {
        limit,
        offset,
        totalCount: rawData[1]
      }
    };
  }
}
