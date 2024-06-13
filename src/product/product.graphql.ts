import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CustomStringScalar } from '../utils/customScalars';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  description: string;

  @Field(() => [CustomStringScalar], { nullable: false })
  categories: string[];

  @Field(() => [Int], { nullable: false })
  variants: number[];
}
