import { getConnection } from 'typeorm'
import { inject, injectable } from 'inversify'
import { CreateOneUserDTO, UpdateOneUserDTO } from './dto/user.dto'
import { UserRepository } from './repositories/user.repository'

import 'reflect-metadata'

@injectable()
export class V1UserService {
  constructor (@inject(UserRepository.name) private userRepository: UserRepository) {
    this.userRepository = getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository)
  }

  async findOneUserById (id:number) :Promise<any> {
    return await this.userRepository.findOneById(id)
  }

  async createOneUserByDTO (dto: CreateOneUserDTO) :Promise<void> {
    return this.userRepository.createOneByDTO(dto)
  }

  async updateOneUserById (dto: UpdateOneUserDTO) :Promise<void> {
    await this.userRepository.updateOneByDTO(dto)
  }

  async deleteOneUserById (id: number) :Promise<void> {
    await this.userRepository.deleteOneById(id)
  }

  async findManyUserByLimitAndOffset (limit:number, offset:number) :Promise<any> {
    return await this.userRepository.findManyByLimitAndOffset(limit, offset)
  }
}
