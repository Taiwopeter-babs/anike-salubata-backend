import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  name: string;
}
