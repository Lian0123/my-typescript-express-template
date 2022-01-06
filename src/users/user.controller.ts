import { inject } from 'inversify'
import {
  Request
} from 'express'
import {
  interfaces,
  controller,
  httpGet,
  httpPut,
  httpPost,
  httpDelete
} from 'inversify-express-utils'
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts'
import { plainToClass } from 'class-transformer'
import { BasicResponses, CreateResponses } from '../common/constant/response.constant'
import { V1UserService } from './user.service'
import { UserAO, UsersAO } from './ao/user.ao'
import { CreateUserBodyDTO, FindUsersQueryDTO, UpdateUserBodyDTO, UserParamDTO } from './dto/user.controller.dto'

import 'reflect-metadata'

@ApiPath({
  name: '/v1/users',
  path: '/v1/users'
})
@controller('/v1/users')
export class V1UserController implements interfaces.Controller {
    public static TARGET_NAME = 'v1_user_controller';

    constructor (
        @inject(V1UserService.name) private userService: V1UserService
    ) {}

    @ApiOperationGet({
      summary: 'A example get one user by id',
      description: 'A example get one user by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'user id number',
            default: 1
          }
        }
      },
      responses: {
        200: {
          description: 'OK',
          model: 'UserAO'
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    @httpGet('/:id')
    async findUserById (
      request: Request
    ): Promise<UserAO> {
      const paramDTO = plainToClass(UserParamDTO, request.params)

      return UserAO.plainToClass(
        await this.userService.findOneUserById(
          paramDTO.id
        )
      )
    }

    @httpPost('/')
    @ApiOperationPost({
      summary: 'A example create one user by body data',
      description: 'A example create one user by body data',
      path: '/',
      parameters: {
        body: {
          required: true,
          model: 'CreateUserBodyDTO'
        }
      },
      responses: CreateResponses
    })
    async createUserById (
      request: Request
    ): Promise<void> {
      const bodyDTO = plainToClass(CreateUserBodyDTO, request.body)
      await this.userService.createOneUserByDTO(bodyDTO)
    }

    @httpPut('/:id')
    @ApiOperationPut({
      summary: 'A example update one user by id and body',
      description: 'A example update one user by id and body',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'user id number',
            default: 1
          }
        },
        body: {
          model: 'UpdateUserBodyDTO'
        }
      },
      responses: BasicResponses
    })
    async updateUserById (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(UserParamDTO, request.params)
      const bodyDTO = plainToClass(UpdateUserBodyDTO, request.body)
      await this.userService.updateOneUserById({
        ...paramDTO,
        ...bodyDTO
      })
    }

    @httpDelete('/:id')
    @ApiOperationDelete({
      summary: 'A example delete one user by id',
      description: 'A example delete one user by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'user id number',
            default: 1
          }
        }
      },
      responses: BasicResponses
    })
    async deleteUserById (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(UserParamDTO, request.params)
      await this.userService.deleteOneUserById(paramDTO.id)
    }

    @ApiOperationGet({
      summary: 'A example get many user by pagination',
      description: 'A example get many user by pagination',
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
          model: 'UsersAO'
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    @httpGet('/')
    async findUsersByDTO (
      request: Request
    ): Promise<UsersAO> {
      const bodyDTO = plainToClass(FindUsersQueryDTO, request.query)
      return UsersAO.plainToClass(
        await this.userService.findManyUserByLimitAndOffset(
          bodyDTO.limit,
          bodyDTO.offset
        )
      )
    }
}
