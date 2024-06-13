import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  CategoryCreateDto,
  CategoryDto,
  CategoryUpdateDto,
} from './category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  public async createCategory(categoryCreateDto: CategoryCreateDto) {
    const category = await this.categoryRepo.createCategory(categoryCreateDto);

    return CategoryDto.fromEntity(category);
  }

  public async getCategory(id: string) {
    const category = await this.categoryRepo.getCategory(id);

    return CategoryDto.fromEntity(category);
  }

  public async getAllCategories() {
    const categories = await this.categoryRepo.getCategories();

    const categoryDtos = categories.map(CategoryDto.fromEntity);

    return categoryDtos;
  }

  public async updateCategory(
    id: string,
    categoryUpdateDto: CategoryUpdateDto,
  ) {
    const isUpdated = await this.categoryRepo.updateCategory(
      id,
      categoryUpdateDto,
    );

    return isUpdated;
  }

  public async deleteCategory(id: string) {
    const isDeleted = await this.categoryRepo.deleteCategory(id);

    return isDeleted;
  }
}
