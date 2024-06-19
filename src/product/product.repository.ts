import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.schema';
import { FilterQuery, Model } from 'mongoose';
import MongooseSerializerInterceptor from '../utils/interceptors/mongoose.interceptor';

import { RequestParamsDto } from '../shared/dataTransferObjects';

import { ProductCreateDto, ProductUpdateDto } from './product.dto';
import { ProductNotFoundException } from '../utils/exceptions/notFound.exception';
import { ProductAlreadyExistsException } from '../utils/exceptions/badRequest.exception';
import { ServerErrorException } from '../utils/exceptions/server.exception';

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
      const isProduct = await this.findProductByCondition({
        name: productDto.title,
      });

      if (isProduct) {
        throw new ProductAlreadyExistsException(productDto.title);
      }

      const product = await this.productModel.create(productDto);

      return product as ProductModel;
    } catch (error) {
      throw error;
    }
  }

  public async getProduct(ProductId: string): Promise<ProductModel> {
    const Product = await this.findProductById(ProductId);

    return Product as ProductModel;
  }

  public async getProducts(
    productParams: RequestParamsDto | null,
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
      throw new ServerErrorException(
        `An error occured within ${this.getProducts.name}: ${error.message}`,
      );
    }
  }

  public async updateProduct(id: string, productDto: ProductUpdateDto) {
    try {
      await this.findProductById(id);

      const result = await this.productModel
        .updateOne({ _id: id }, { ...productDto })
        .exec();

      return result.acknowledged;
    } catch (error) {
      throw error;
    }
  }

  public async deleteProduct(id: string) {
    try {
      await this.findProductById(id);

      const result = await this.productModel.deleteOne({ _id: id }).exec();

      return result.acknowledged;
    } catch (error) {
      throw error;
    }
  }

  // private async findProductByName(productTitle: string) {
  //   const product = await this.findProductByCondition({ name: productTitle });

  //   return product;
  // }

  private async findProductByCondition(condition: FilterQuery<ProductModel>) {
    try {
      const product = await this.productModel
        .findOne(condition)
        .collation({ locale: 'en', strength: 2 }) // added for case-insensitive search
        .exec();

      return product;
    } catch (error) {
      throw new ServerErrorException(
        `An error occured within ${this.findProductByCondition.name}: ${error.message}`,
      );
    }
  }

  private async findProductById(ProductId: string) {
    try {
      const product = await this.productModel.findById(ProductId).exec();

      if (!product) {
        throw new ProductNotFoundException(ProductId);
      }

      return product;
    } catch (error) {
      if (error.name === 'ProductNotFoundException') {
        throw error;
      }

      throw new ServerErrorException(
        `An error occured within ${this.findProductById.name}: ${error.message}`,
      );
    }
  }

  private getPageParams(params: RequestParamsDto | null) {
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
