import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../category/category.schema';
import { BaseSchema } from '../utils/base.schema';
import { Variant } from '../variant/variant.schema';

@Schema()
export class Product extends BaseSchema {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Variant.name }])
  variants: Variant[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }])
  categories: Category[];
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
