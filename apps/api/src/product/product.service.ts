import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { ProductProperty } from './entities/product-property.entity';

type ProductWithTasks = Product & { tasks?: Task[] };

// TODO: update unit tests
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>,
    @InjectRepository(ProductProperty) private _propertyRepository: Repository<ProductProperty>
  ) {}

  // TODO: check 'await'
  async create(createProductDto: CreateProductDto) {
    // Step 1: Save the product first
    const product = await this._repository.save(createProductDto);

    // Step 2: Save the properties to the product
    if (createProductDto.properties) {
      const properties = Object.keys(createProductDto.properties).map((key) => {
        return this._propertyRepository.create({
          key,
          value: createProductDto.properties[key],
          product: product,
        });
      });
      await this._propertyRepository.save(properties);
    }

    return product;
  }

  async findAll() {
    return this._repository.find({
      relations: ['tasks', 'properties'], // Automatically loads tasks and properties with each product
                                          // TypeORM will join the Task & Product Properties tables with Product in a single query, avoiding the need to loop and fetch tasks individually.
    });

    // alternative solution
    // return this._repository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.tasks', 'task')
    //   .getMany()
  }

  // TODO: this need properties as well?
  // findOne(id: string) {
  //   return this._repository.findOne({
  //     where: { id },
  //     relations: ['tasks', 'properties'],
  //   });
  // }
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
