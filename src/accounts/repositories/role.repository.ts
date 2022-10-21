/* Import Package */
import { decorate, injectable } from 'inversify';

/* Inject Member */
import { EntityRepository, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';

/* Type Define */
import { CreateOneRoleDTO, UpdateOneRoleDTO } from '../dto/role.repository.dto';
import { RolePO, RolesPO } from '../po/role.po';

/* Inject Reference */
import 'reflect-metadata';

decorate(injectable(), RoleEntity);

@injectable()
@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  async findOneById (id: number) : Promise<RolePO> {
    return await this.findOne({ id });
  }

  async findManyByIds (ids: number[]) : Promise<RolePO[]> {
    if(!ids.length){
      return [];
    }
    return await this.findByIds(ids);
  }

  async createOneByDTO (dto: CreateOneRoleDTO) : Promise<RolePO> {
    return await this.save({ ...dto });
  }

  async updateOneByDTO (dto: UpdateOneRoleDTO) : Promise<void> {
    await this.update({ id: dto.id }, { ...dto });
  }

  async deleteOneById (id:number) : Promise<void> {
    await this.update({ id }, { isDeleted: true });
  }

  async findManyByLimitAndOffset (limit: number, offset: number) : Promise<RolesPO> {
    const rawData = await this.createQueryBuilder('roles').limit(limit).offset(offset).getManyAndCount();
    return {
      items: rawData[0],
      pagination: {
        limit,
        offset,
        totalCount: rawData[1]
      }
    };
  }

  async updateManyCountByIds ( addRoleIds: number[], subRoleIds: number[]) : Promise<void> {
    if(subRoleIds?.length){
      console.log(this.createQueryBuilder('roles')
      .update(RoleEntity)
      .whereInIds(subRoleIds)
      .set({ totalCount: () => '"totalCount" - 1' }).getSql());
      await this.createQueryBuilder('roles')
        .update(RoleEntity)
        .whereInIds(subRoleIds)
        .set({ totalCount: () => '"totalCount" - 1' })
        .execute();
    }
    if(addRoleIds?.length){
      console.log(this.createQueryBuilder('roles')
      .update(RoleEntity)
      .whereInIds(addRoleIds)
      .set({ totalCount: () => '"totalCount" + 1' }).getSql());
      await this.createQueryBuilder('roles')
        .update(RoleEntity)
        .whereInIds(addRoleIds)
        .set({ totalCount: () => '"totalCount" + 1' })
        .execute();
    }
  }
}
