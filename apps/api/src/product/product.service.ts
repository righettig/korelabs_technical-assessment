import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';

type ProductWithTasks = Product & { tasks?: Task[] };

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto) {
    return this._repository.save(createProductDto);
  }

  async findAll() {
    return this._repository.find({
      relations: ['tasks'], // Automatically loads tasks with each product
                            // TypeORM will join the Task table with Product in a single query, avoiding the need to loop and fetch tasks individually.
    });

    // alternative solution
    // return this._repository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.tasks', 'task')
    //   .getMany()
  }

  findOne(id: string) {
    return this._repository.findOneBy({ id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this._repository.save({ ...updateProductDto, id });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }
}
