import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Variant } from './variant.schema';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class VariantCreateDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  public size: number;
}

@InputType()
export class VariantUpdateDto extends VariantCreateDto {}

@ObjectType()
export class VariantDto {
  @Expose()
  id: string;

  @Expose()
  public size: number;

  static fromEntity(entity: Variant): VariantDto {
    const dto = plainToInstance(VariantDto, entity);

    return dto;
  }
}
