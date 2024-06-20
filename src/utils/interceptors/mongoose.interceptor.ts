import {
  ClassSerializerContextOptions,
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

type SerializerType = typeof ClassSerializerInterceptor;

/**
 * Serialize mongoose document to javascript class
 */
export function MongooseSerializerInterceptor(
  classToIntercept: Type,
): SerializerType {
  return class MongooseInterceptor extends ClassSerializerInterceptor {
    private changeMongooseObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) return document;

      return plainToClass(classToIntercept, document);
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changeMongooseObjectToClass);
      }

      return this.changeMongooseObjectToClass(response);
    }
    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassSerializerContextOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
