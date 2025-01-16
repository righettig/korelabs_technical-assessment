import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { ProductProperty } from './entities/product-property.entity';

type ProductDto = {
  id: string;
  name: string;
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
  tasks: Task[];
}

// TODO: update unit tests
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>,
    @InjectRepository(ProductProperty) private _propertyRepository: Repository<ProductProperty>
  ) { }

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

  async findAll(): Promise<ProductDto[]> {
    const products = await this._repository.find({
      // Automatically loads tasks and properties with each product
      // TypeORM will join the Task & Product Properties tables with Product in a single query, avoiding the need to loop and fetch tasks individually.
      relations: ['tasks', 'properties'], 
    });

    return products.map(this.transformToProductDto);
  }

  async findOne(id: string): Promise<ProductDto> {
    let product = await this._repository.findOne({
      where: { id },
      relations: ['tasks', 'properties'],
    });

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return this.transformToProductDto(product);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this._repository.save({ ...updateProductDto, id });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }

  private transformToProductDto(product: Product): ProductDto {
    const properties = product.properties.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

    return {
      id: product.id,
      name: product.name,
      properties,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      tasks: product.tasks,
    };
  }
}
