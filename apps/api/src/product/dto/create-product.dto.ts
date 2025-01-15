import { IsOptional, IsString } from "class-validator";
import { ProductProperty } from "../entities/product-property.entity";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  properties?: ProductProperty[]
}
