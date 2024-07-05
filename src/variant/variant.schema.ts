import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '../shared/base.schema';

@Schema({ timestamps: true })
export class VariantModel extends BaseSchema {
  @Prop({ required: true })
  size: number;
}

export type VariantDocument = HydratedDocument<VariantModel>;

export const VariantSchema = SchemaFactory.createForClass(VariantModel);
