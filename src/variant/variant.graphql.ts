import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Variant {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { nullable: false })
  size: number;
}

/**
 * Mutation type for delete and update mutation requests
 */
@ObjectType()
export class MutationResult {
  @Field({ nullable: false })
  success?: boolean;
}
