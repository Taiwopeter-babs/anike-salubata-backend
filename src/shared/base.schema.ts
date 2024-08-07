import { Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Expose, Transform } from 'class-transformer';

@Schema()
export abstract class BaseSchema {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
}
