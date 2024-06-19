import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { BaseSchema } from '../shared/base.schema';

@Schema()
export class Variant extends BaseSchema {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  size: number;
}

export type VariantDocument = HydratedDocument<Variant>;

export const VariantSchema = SchemaFactory.createForClass(Variant);
