import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '../shared/base.schema';

@Schema({ timestamps: true })
export class OrderModel extends BaseSchema {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true, unique: true, index: true })
  trackingId: string;

  @Prop({ required: true })
  products: string[];
}

export type OrderDocument = HydratedDocument<OrderModel>;

const OrderSchema = SchemaFactory.createForClass(OrderModel);

export { OrderSchema };
