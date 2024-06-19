import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class RequestParamsDto {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchString?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortString?: string;
}
