import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('product_properties')
export class ProductProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.properties)
  product: Product;
}
