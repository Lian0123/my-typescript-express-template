/* Import Package */
import { inject, injectable } from 'inversify';

/* Inject Member */
import { getConnection } from 'typeorm';
import { Connection as AmqpConnection } from 'amqplib';
import { RoleRepository } from './repositories/role.repository';

/* Controller Layer */
import { createRoleEvent, updateRoleEvent } from './role.event.controller';

/* Type Define */
import { CreateOneRoleDTO, UpdateOneRoleDTO } from './dto/role.service.dto';
import { RoleBO, RolesBO } from './bo/role.bo';

/* Inject Reference */
import 'reflect-metadata';

/* Environment Variables */
const { POSTGRESQL_CONNECTION_NAME } = process.env;

@injectable()
export class V1RoleService {
  constructor (
    @inject(RoleRepository.name) private roleRepository: RoleRepository,
    @inject('rabbitMQConnection') private rabbitMQConnection: AmqpConnection
  ) {
    this.roleRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(RoleRepository);
  }

  async findOneRoleById (id:number) :Promise<RoleBO> {
    return await this.roleRepository.findOneById(id);
  }

  async createOneRoleByDTO (dto: CreateOneRoleDTO) :Promise<RoleBO> {
    const roleData = await this.roleRepository.createOneByDTO(dto);
    await createRoleEvent(this.rabbitMQConnection, roleData);
    return roleData;
  }

  async updateOneRoleById (dto: UpdateOneRoleDTO) :Promise<RoleBO> {
    const roleData = await this.roleRepository.updateOneByDTO(dto);
    await updateRoleEvent(this.rabbitMQConnection, roleData);
    return roleData;
  }

  async deleteOneRoleById (id: number) :Promise<void> {
    await this.roleRepository.deleteOneById(id);
  }

  async findManyRoleByLimitAndOffset (limit:number, offset:number) :Promise<RolesBO> {
    return await this.roleRepository.findManyByLimitAndOffset(limit, offset);
  }
}
