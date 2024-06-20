import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '../shared/base.schema';

@Schema()
export class Variant extends BaseSchema {
  @Prop({ required: true })
  size: number;
}

export type VariantDocument = HydratedDocument<Variant>;

export const VariantSchema = SchemaFactory.createForClass(Variant);
