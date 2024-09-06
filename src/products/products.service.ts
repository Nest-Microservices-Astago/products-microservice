import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  Query,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect().then((res) => this.logger.log('Database connected'));
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(pagination: PaginationDto, options: { available: boolean } = { available: true }) {
    const { page, limit } = pagination;
    const totalItem = await this.product.count({ where: { available: options.available } });
    const totalPages = Math.ceil(totalItem / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: options.available,
        },
      }),
      meta: {
        totalItems: totalItem,
        currentPage: page,
        totalPages: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.product.findFirst({
      where: { id: id, available: true },
    });

    if (!item) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return item;
  }

  async update(updateProductDto: UpdateProductDto) {

    const {id: id, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id: id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.product.delete({
    //   where: { id: id },
    // });

    return this.product.update({
      where: { id: id },
      data: {
        available: false,
      },
    });
  }

}
