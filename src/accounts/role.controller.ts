/* Import Package */
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { inject } from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  httpPut,
  httpPost,
  httpDelete
} from 'inversify-express-utils';
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts';

/* Service Layer */
import { V1RoleService } from './role.service';

/* Type & Interface */
import { RoleAO, RolesAO } from './ao/role.ao';
import {
  CreateRoleBodyDTO,
  FindRolesQueryDTO,
  UpdateRoleBodyDTO,
  RoleParamDTO
} from './dto/role.controller.dto';

/* Enum & Constant */
import { BasicResponses, CreateResponses } from '../common/constants';

/* Inject Reference */
import 'reflect-metadata';

@ApiPath({
    name: '/v1/roles',
    path: '/v1/roles'
  })
@controller('/v1/roles')
export class V1RoleController implements interfaces.Controller {
    public static TARGET_NAME = 'v1_role_controller';

    constructor (
        @inject(V1RoleService.name) private roleService: V1RoleService
    ) {}

    @httpPost('/')
    @ApiOperationPost({
      summary: 'A example create one role by body data',
      description: 'A example create one role by body data',
      path: '/',
      parameters: {
        body: {
          required: true,
          model: CreateRoleBodyDTO.name
        }
      },
      responses: CreateResponses
    })
    async createRoleByDTO (
      request: Request
    ): Promise<void> {
      const bodyDTO = plainToClass(CreateRoleBodyDTO, request.body);
      await this.roleService.createOneRoleByDTO(bodyDTO);
    }

    @httpPut('/:id')
    @ApiOperationPut({
      summary: 'A example update one role by id and body',
      description: 'A example update one role by id and body',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'role id number',
            default: 1
          }
        },
        body: {
          model: UpdateRoleBodyDTO.name
        }
      },
      responses: BasicResponses
    })
    async updateRoleById (
        request: Request
    ): Promise<void> {
        const paramDTO = plainToClass(RoleParamDTO, request.params);
        const bodyDTO = plainToClass(UpdateRoleBodyDTO, request.body);
        await this.roleService.updateOneRoleById({
          ...paramDTO,
          ...bodyDTO
        });
    }

    @httpDelete('/:id')
    @ApiOperationDelete({
      summary: 'A example delete one role by id',
      description: 'A example delete one role by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'role id number',
            default: 1
          }
        }
      },
      responses: BasicResponses
    })
    async deleteRoleById (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(RoleParamDTO, request.params);
      await this.roleService.deleteOneRoleById(paramDTO.id);
    }


    @ApiOperationGet({
      summary: 'A example get one role by id',
      description: 'A example get one role by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'role id number',
            default: 1
          }
        }
      },
      responses: {
        200: {
          description: 'OK',
          model: RoleAO.name
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    @httpGet('/:id')
    async findRoleById (
      request: Request
    ): Promise<RoleAO> {
      const paramDTO = plainToClass(RoleParamDTO, request.params);

      return RoleAO.plainToClass(
        await this.roleService.findOneRoleById(
          paramDTO.id
        )
      );
    }

    @httpGet('/')
    @ApiOperationGet({
      summary: 'A example get many role by pagination',
      description: 'A example get many role by pagination',
      path: '/',
      parameters: {
        query: {
          limit: {
            required: false,
            type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
            description: 'Query row data count',
            default: 30
          },
          offset: {
            required: false,
            type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
            description: 'Query page offset',
            default: 0
          }
        }
      },
      responses: {
        200: {
          description: 'OK',
          model: RolesAO.name
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    async findRolesByDTO (
      request: Request
    ): Promise<RolesAO> {
      const bodyDTO = plainToClass(FindRolesQueryDTO, request.query);
      return RolesAO.plainToClass(
        await this.roleService.findManyRoleByLimitAndOffset(
          bodyDTO.limit,
          bodyDTO.offset
        )
      );
    }
}