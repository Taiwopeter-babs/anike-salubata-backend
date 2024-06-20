import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.graphql';
import { ProductDto } from 'src/product/product.dto';
import { CustomStringScalar } from 'src/utils/customScalars';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  userId: string;

  @Field({ nullable: false })
  trackingId: string;

  @Field(() => [CustomStringScalar], { nullable: false })
  products: string[];
}
