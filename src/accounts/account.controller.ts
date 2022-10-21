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
import { V1AccountService } from './account.service';

/* Type & Interface */
import { AccountAO, AccountsAO } from './ao/account.ao';
import {
  CreateAccountBodyDTO,
  FindAccountsQueryDTO,
  UpdateAccountBodyDTO,
  AccountParamDTO,
  UpdateAccountRoleBodyDTO
} from './dto/account.controller.dto';

/* Enum & Constant */
import { BasicResponses, CreateResponses } from '../common/constants';

/* Inject Reference */
import 'reflect-metadata';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@ApiPath({
  name: '/v1/accounts',
  path: '/v1/accounts'
})
@controller('/v1/accounts')
export class V1AccountController implements interfaces.Controller {
    public static TARGET_NAME = 'v1_account_controller';

    constructor (
        @inject(V1AccountService.name) private accountService: V1AccountService
    ) {}

    @httpGet('/:id')
    @ApiOperationGet({
      summary: 'A example get one account by id',
      description: 'A example get one account by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'account id number',
            default: 1
          }
        }
      },
      responses: {
        200: {
          description: 'OK',
          model: AccountAO.name
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    async findAccountById (
      request: Request
    ): Promise<AccountAO> {
      const paramDTO = plainToClass(AccountParamDTO, request.params);

      return AccountAO.plainToClass(
        await this.accountService.findOneAccountById(
          paramDTO.id
        )
      );
    }

    @httpPost('/')
    @ApiOperationPost({
      summary: 'A example create one account by body data',
      description: 'A example create one account by body data',
      path: '/',
      parameters: {
        body: {
          required: true,
          model: CreateAccountBodyDTO.name
        }
      },
      responses: CreateResponses
    })
    async createAccountByDTO (
      request: Request
    ): Promise<void> {
      const bodyDTO = plainToClass(CreateAccountBodyDTO, request.body);
      await this.accountService.createOneAccountByDTO(bodyDTO);
    }

    @httpPut('/:id')
    @ApiOperationPut({
      summary: 'A example update one account by id and body',
      description: 'A example update one account by id and body',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'account id number',
            default: 1
          }
        },
        body: {
          model: UpdateAccountBodyDTO.name
        }
      },
      responses: BasicResponses
    })
    async updateAccountById (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(AccountParamDTO, request.params);
      const bodyDTO = plainToClass(UpdateAccountBodyDTO, request.body);
      await this.accountService.updateOneAccountById({
        ...paramDTO,
        ...bodyDTO
      });
    }

    @httpDelete('/:id')
    @ApiOperationDelete({
      summary: 'A example delete one account by id',
      description: 'A example delete one account by id',
      path: '/{id}',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'account id number',
            default: 1
          }
        }
      },
      responses: BasicResponses
    })
    async deleteAccountById (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(AccountParamDTO, request.params);
      await this.accountService.deleteOneAccountById(paramDTO.id);
    }

    @httpGet('/')
    @ApiOperationGet({
      summary: 'A example get many account by pagination',
      description: 'A example get many account by pagination',
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
          model: AccountsAO.name
        },
        400: {
          description: 'Bad Request'
        }
      }
    })
    async findAccountsByDTO (
      request: Request
    ): Promise<AccountsAO> {
      const bodyDTO = plainToClass(FindAccountsQueryDTO, request.query);
      return AccountsAO.plainToClass(
        await this.accountService.findManyAccountByLimitAndOffset(
          bodyDTO.limit,
          bodyDTO.offset
        )
      );
    }

    @httpPut('/:id/role')
    @ApiOperationPut({
      summary: 'A example update one account role config by id and body',
      description: 'A example update one account role config by id and body',
      path: '/{id}/role',
      parameters: {
        path: {
          id: {
            required: true,
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            description: 'account id number',
            default: 1
          }
        },
        body: {
          model: UpdateAccountRoleBodyDTO.name
        }
      },
      responses: BasicResponses
    })
    @Transactional()
    async updateAccountRoleByDTO (
      request: Request
    ): Promise<void> {
      const paramDTO = plainToClass(AccountParamDTO, request.params);
      const bodyDTO = plainToClass(UpdateAccountRoleBodyDTO, request.body);
      await this.accountService.updateAccountRoleByDTO({ ...paramDTO, ...bodyDTO });
    }
}
