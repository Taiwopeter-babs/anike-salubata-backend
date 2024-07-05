import { ObjectType, Field } from '@nestjs/graphql';

/**
 * Mutation type for delete and update mutation requests
 */
@ObjectType()
export class MutationResult {
  @Field({ nullable: false })
  success?: boolean;
}
