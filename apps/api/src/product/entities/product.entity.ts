import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity";
import { ProductProperty } from "./product-property.entity";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => ProductProperty, (productProperty) => productProperty.product, { cascade: true })
  properties: ProductProperty[];

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.product, { onDelete: 'CASCADE' })
  tasks: Task[];
}
