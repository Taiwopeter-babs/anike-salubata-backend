import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import MongooseSerializerInterceptor from '../utils/interceptors/mongoose.interceptor';

import { CategoryCreateDto, CategoryUpdateDto } from './category.dto';
import { CategoryNotFoundException } from '../utils/exceptions/notFound.exception';
import { CategoryAlreadyExistsException } from '../utils/exceptions/badRequest.exception';

/**
 * The repository for the category.
 * All the mongoose document type returned are converted to the `Category` type class
 * by the interceptor.
 */
@UseInterceptors(MongooseSerializerInterceptor(Category))
@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  public async createCategory(categoryDto: CategoryCreateDto) {
    const isCategory = await this.findCategoryByName(categoryDto.name);

    if (isCategory) {
      throw new CategoryAlreadyExistsException(categoryDto.name);
    }
    const category = await this.categoryModel.create(categoryDto);

    return category as Category;
  }

  public async getCategory(categoryId: string): Promise<Category> {
    const category = await this.findCategoryById(categoryId);

    return category as Category;
  }

  public async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find();

    return categories as Category[];
  }

  public async updateCategory(id: string, categoryDto: CategoryUpdateDto) {
    await this.findCategoryById(id);

    const result = await this.categoryModel
      .updateOne({ _id: id }, { name: categoryDto.name })
      .exec();

    return result.acknowledged;
  }

  public async deleteCategory(id: string) {
    await this.findCategoryById(id);

    const result = await this.categoryModel.deleteOne({ _id: id }).exec();

    return result.acknowledged;
  }

  private async findCategoryByName(categoryName: string) {
    const category = await this.categoryModel
      .findOne({ name: categoryName })
      .collation({ locale: 'en', strength: 2 }) // added for case-insensitive search
      .exec();

    return category;
  }

  private async findCategoryById(categoryId: string) {
    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    return category;
  }
}
