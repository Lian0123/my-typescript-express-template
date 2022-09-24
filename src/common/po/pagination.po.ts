import { Expose } from 'class-transformer';

export class PaginationPO {
    @Expose()
    limit: number;

    @Expose()
    offset: number;

    @Expose()
    totalCount: number;
}
