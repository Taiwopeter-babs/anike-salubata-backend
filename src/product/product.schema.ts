import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '../utils/base.schema';

@Schema()
export class ProductModel extends BaseSchema {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  variants: number[];

  @Prop()
  categories: string[];
}

export type ProductDocument = HydratedDocument<ProductModel>;

const ProductSchema = SchemaFactory.createForClass(ProductModel);

// Add index to description
ProductSchema.index({ description: 'text' });

export { ProductSchema };
