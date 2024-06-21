import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CategoryModel } from './category.schema';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CategoryCreateDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  public name: string;
}

@InputType()
export class CategoryUpdateDto extends CategoryCreateDto {}

@ObjectType()
export class CategoryDto {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field()
  public name: string;

  static fromEntity(entity: CategoryModel): CategoryDto {
    const dto = plainToInstance(CategoryDto, entity);

    return dto;
  }
}
