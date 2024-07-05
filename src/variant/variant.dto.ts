import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { VariantModel } from './variant.schema';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class VariantCreateDto {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  public size: number;
}

@InputType()
export class VariantUpdateDto extends VariantCreateDto {}

@ObjectType()
export class VariantDto {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field(() => Int)
  public size: number;

  @Expose()
  @Field()
  public createdAt: Date;

  @Expose()
  @Field()
  public updatedAt: Date;

  static fromEntity(entity: VariantModel): VariantDto {
    const dto = plainToInstance(VariantDto, entity);

    return dto;
  }
}
