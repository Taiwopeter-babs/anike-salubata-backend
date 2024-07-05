import { Expose, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductModel } from './product.schema';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CategoryCreateDto } from '../category/category.dto';
import { VariantCreateDto } from '../variant/variant.dto';
import { CustomStringScalar } from '@utils/custom/customScalars';

@InputType()
export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  public title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  public description: string;

  @Field(() => [CustomStringScalar])
  @Type(() => String)
  @IsArray()
  @IsDefined()
  public categories: string[];

  @Field(() => [Int])
  @IsNumber({}, { each: true })
  @Type(() => Array)
  @IsArray()
  @IsDefined()
  public variants: number[];
}

@InputType()
export class ProductUpdateDto {
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  public title?: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  public description?: string;

  @Field(() => [CategoryCreateDto], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => CategoryCreateDto)
  @IsArray()
  @IsDefined()
  public categories?: CategoryCreateDto[];

  @Field(() => [VariantCreateDto], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => VariantCreateDto)
  @IsArray()
  @IsDefined()
  public variants?: VariantCreateDto[];
}

@ObjectType()
export class ProductDto {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field()
  public title: string;

  @Expose()
  @Field()
  public description: string;

  @Expose()
  @Field(() => [CustomStringScalar])
  @Type(() => String)
  public categories: string[];

  @Expose()
  @Field(() => [Int])
  @Type(() => Number)
  public variants: number[];

  @Expose()
  @Field()
  public createdAt: Date;

  @Expose()
  @Field()
  public updatedAt: Date;

  static fromEntity(entity: ProductModel): ProductDto {
    const dto = plainToInstance(ProductDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dto;
  }
}
