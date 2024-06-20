import { Expose, plainToInstance } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator';

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CustomStringScalar } from '../utils/customScalars';
import { OrderModel } from './order.schema';
import { ProductDto } from '../product/product.dto';

@InputType()
export class OrderCreateDto {
  @IsNumber()
  @IsDefined()
  @Field(() => Int)
  public userId: number;

  @Field(() => [CustomStringScalar])
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  public products: string[];
}

@ObjectType()
export class OrderDto {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field()
  public trackingId: string;

  @Expose()
  @Field()
  public userId: string;

  @Expose()
  @Field(() => [ProductDto])
  public products: ProductDto[];

  // @Expose()
  // @Field(() => [CustomStringScalar])
  // public products: string[];

  static fromEntity(entity: OrderModel): OrderDto {
    const dto = plainToInstance(OrderDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dto;
  }
}
