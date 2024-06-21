import { Module } from '@nestjs/common';
import { CategoryModel, CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryModel.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryService, CategoryResolver, CategoryRepository],
})
export class CategoryModule {}
