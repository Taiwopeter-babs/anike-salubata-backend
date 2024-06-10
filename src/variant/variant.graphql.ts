import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Variant {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { nullable: false })
  size: number;
}

@ObjectType()
export class MutationResult {
  @Field({ nullable: true })
  success?: boolean;
}
