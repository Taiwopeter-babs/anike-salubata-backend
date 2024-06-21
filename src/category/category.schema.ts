import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../shared/base.schema';

@Schema()
export class CategoryModel extends BaseSchema {
  @Prop({ index: true })
  name: string;
}

export type CategoryDocument = HydratedDocument<CategoryModel>;

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
