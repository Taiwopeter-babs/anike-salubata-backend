import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationResult } from '@variant';
import { Category } from './category.grapql';
import { CategoryService } from './category.service';
import {
  CategoryCreateDto,
  CategoryDto,
  CategoryUpdateDto,
} from './category.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => CategoryDto, { name: 'category' })
  async getCategory(@Args('id') id: string) {
    const category = await this.categoryService.getCategory(id);

    return category;
  }

  @Query(() => [CategoryDto], { name: 'categories' })
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();

    return categories;
  }

  @Mutation(() => CategoryDto, { name: 'category' })
  async createCategory(
    @Args('newCategory', { nullable: false }) category: CategoryCreateDto,
  ) {
    const newCategory = await this.categoryService.createCategory(category);

    return newCategory;
  }

  @Mutation(() => MutationResult, { name: 'updateCategory' })
  async updateCategory(
    @Args('id', { nullable: false }) id: string,
    @Args('category', { nullable: false }) category: CategoryUpdateDto,
  ) {
    const isUpdated = await this.categoryService.updateCategory(id, category);

    return { success: isUpdated };
  }

  @Mutation(() => MutationResult, { name: 'deleteCategory' })
  async deleteCategory(@Args('id', { nullable: false }) id: string) {
    const isDeleted = await this.categoryService.deleteCategory(id);

    return { success: isDeleted };
  }
}
