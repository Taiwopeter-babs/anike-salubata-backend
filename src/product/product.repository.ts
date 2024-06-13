import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.schema';
import { FilterQuery, Model } from 'mongoose';
import MongooseSerializerInterceptor from '../utils/interceptors/mongoose.interceptor';

import {
  ProductCreateDto,
  ProductUpdateDto,
  ProductsParamsDto,
} from './product.dto';
import { ProductNotFoundException } from '../utils/exceptions/notFound.exception';
import { ProductAlreadyExistsException } from '../utils/exceptions/badRequest.exception';

/**
 * The repository for the Product.
 * All the mongoose document type returned are converted to the `Product` type class
 * by the interceptor.
 */
@UseInterceptors(MongooseSerializerInterceptor(ProductModel))
@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  public async createProduct(productDto: ProductCreateDto) {
    try {
      const isProduct = await this.findProductByName(productDto.title);

      console.log(isProduct);

      if (isProduct) {
        throw new ProductAlreadyExistsException(productDto.title);
      }
      const product = await this.productModel.create(productDto);

      return product as ProductModel;
    } catch (error) {
      console.error(error);
    }
  }

  public async getProduct(ProductId: string): Promise<ProductModel> {
    const Product = await this.findProductById(ProductId);

    return Product as ProductModel;
  }

  public async getProducts(
    productParams: ProductsParamsDto | null,
  ): Promise<ProductModel[] | void> {
    try {
      const searchString = productParams ? productParams.searchString : '';

      const pageParams = this.getPageParams(productParams);

      const filter: FilterQuery<ProductModel> = {};

      // Add search
      if (searchString !== undefined) {
        filter.$text = { $search: searchString };
      }

      const findQuery = this.productModel
        .find(filter)
        .sort({ _id: 1 })
        .skip(pageParams.skip)
        .limit(pageParams.pageSize);

      const products = await findQuery;

      return products as ProductModel[];
    } catch (error) {
      console.error(error);
    }
  }

  public async updateProduct(id: string, productDto: ProductUpdateDto) {
    await this.findProductById(id);

    const result = await this.productModel
      .updateOne({ _id: id }, { ...productDto })
      .exec();

    return result.acknowledged;
  }

  public async deleteProduct(id: string) {
    await this.findProductById(id);

    const result = await this.productModel.deleteOne({ _id: id }).exec();

    return result.acknowledged;
  }

  private async findProductByName(productTitle: string) {
    const product = await this.productModel
      .findOne({ name: productTitle })
      .collation({ locale: 'en', strength: 2 }) // added for case-insensitive search
      .exec();

    return product;
  }

  private async findProductById(ProductId: string) {
    const product = await this.productModel.findById(ProductId).exec();

    if (!product) {
      throw new ProductNotFoundException(ProductId);
    }

    return product;
  }

  private getPageParams(params: ProductsParamsDto | null) {
    if (!params) {
      return { skip: 0, pageSize: 20 };
    }

    const pageSize = params.pageSize ?? 20;
    const pageNumber = params.pageNumber ?? 1;

    return {
      skip: (pageNumber - 1) * pageSize,
      pageSize,
    };
  }
}
