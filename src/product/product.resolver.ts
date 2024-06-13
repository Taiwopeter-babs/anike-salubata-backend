import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MutationResult } from '../variant/variant.graphql';

import { ProductService } from './product.service';

import {
  ProductCreateDto,
  ProductDto,
  ProductUpdateDto,
  ProductsParamsDto,
} from './product.dto';
import { CustomStringScalar } from '../utils/customScalars';

@Resolver(() => ProductDto)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductDto, { name: 'product' })
  async getProduct(@Args('id') id: string) {
    const product = await this.productService.getProduct(id);

    return product;
  }

  @Query(() => [ProductDto], { name: 'products' })
  async getProducts(
    @Args('productParameters', { nullable: true })
    productParams: ProductsParamsDto,
  ) {
    const products = await this.productService.getProducts(productParams);

    return products;
  }

  @Mutation(() => ProductDto, { name: 'product' })
  async createProduct(
    @Args('newProduct', { nullable: false }) product: ProductCreateDto,
  ) {
    const newProduct = await this.productService.createProduct(product);

    return newProduct;
  }

  @Mutation(() => MutationResult, { name: 'updateProduct' })
  async updateProduct(
    @Args('id', { nullable: false }) id: string,
    @Args('product', { nullable: false }) product: ProductUpdateDto,
  ) {
    const isUpdated = await this.productService.updateProduct(id, product);

    return { success: isUpdated };
  }

  @Mutation(() => MutationResult, { name: 'deleteProduct' })
  async deleteProduct(@Args('id', { nullable: false }) id: string) {
    const isDeleted = await this.productService.deleteProduct(id);

    return { success: isDeleted };
  }

  @ResolveField(() => [CustomStringScalar])
  async categories(@Parent() product: ProductDto) {
    const { id } = product;
    const prod = await this.productService.getProduct(id);

    return prod.categories;
  }

  @ResolveField(() => [Int])
  async variants(@Parent() product: ProductDto) {
    const { id } = product;
    const prod = await this.productService.getProduct(id);

    return prod.variants;
  }
}
