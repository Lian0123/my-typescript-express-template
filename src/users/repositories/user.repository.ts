import { decorate, injectable } from 'inversify'
import { EntityRepository, Repository } from 'typeorm'
import { UserEntity } from '../entities/user.entity'
import { CreateOneUserDTO, UpdateOneUserDTO } from '../dto/user.dto'

import 'reflect-metadata'

decorate(injectable(), Repository)
decorate(injectable(), UserEntity)

@injectable()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOneById (id: number) : Promise<any> {
    return await this.findOne({ id })
  }

  async createOneByDTO (dto: CreateOneUserDTO) : Promise<void> {
    await this.save({ ...dto })
  }

  async updateOneByDTO (dto: UpdateOneUserDTO) : Promise<void> {
    await this.update({ id: dto.id }, { ...dto })
  }

  async deleteOneById (id:number) : Promise<void> {
    await this.delete({ id })
  }

  async findManyByLimitAndOffset (limit: number, offset: number) : Promise<any> {
    const rawData = await this.createQueryBuilder('user').limit(limit).offset(offset).getManyAndCount()
    return {
      items: rawData[0],
      Pagination: {
        limit,
        offset,
        totalCount: rawData[1]
      }
    }
  }
}
