import { Module } from '@nestjs/common';
import { Category, CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
})
export class CategoryModule {}
