import { HttpException, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';

import { ProductCreateDto, ProductUpdateDto } from './product.dto';

import {
  IProductQuery,
  getPageParams,
  ServerErrorException,
  ProductAlreadyExistsException,
  ProductNotFoundException,
  MongooseSerializerInterceptor,
} from '@utils';

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
      this.handleError(error, this.createProduct.name);
    }
  }

  public async getProduct(ProductId: string): Promise<ProductModel> {
    const Product = await this.findProductById(ProductId);

    return Product as ProductModel;
  }

  public async getProducts(
    params?: IProductQuery,
  ): Promise<ProductModel[] | void> {
    try {
      const { requestParams, condition } = params ?? {};

      const searchString = requestParams ? requestParams.searchString : '';

      const pageParams = getPageParams(requestParams);

      const filter: FilterQuery<ProductModel> = condition
        ? { ...condition }
        : {};

      // Add search
      if (searchString !== undefined) {
        filter.$text = { $search: searchString, $caseSensitive: false };
      }

      const findQuery = this.productModel
        .find(filter)
        .sort({ _id: 1 })
        .skip(pageParams.skip)
        .limit(pageParams.pageSize);

      const products = await findQuery.exec();

      return products as ProductModel[];
    } catch (error) {
      this.handleError(error, this.getProducts.name);
    }
  }

  public async getProductsFromIdArray(
    idsList: string[],
  ): Promise<ProductModel[] | void> {
    try {
      const arrayObjectId = idsList.map(
        (id) => new mongoose.Types.ObjectId(id),
      );

      const products = await this.productModel
        .find({
          _id: { $in: arrayObjectId },
        })
        .exec();

      return products;
    } catch (error) {
      this.handleError(error, this.getProductsFromIdArray.name);
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
      this.handleError(error, this.updateProduct.name);
    }
  }

  public async deleteProduct(id: string) {
    try {
      await this.findProductById(id);

      const result = await this.productModel.deleteOne({ _id: id }).exec();

      return result.acknowledged;
    } catch (error) {
      this.handleError(error, this.deleteProduct.name);
    }
  }

  private async findProductByCondition(condition: FilterQuery<ProductModel>) {
    try {
      const product = await this.productModel
        .findOne(condition)
        .collation({ locale: 'en', strength: 2 }) // added for case-insensitive search
        .exec();

      return product;
    } catch (error) {
      this.handleError(error, this.findProductById.name);
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
      this.handleError(error, this.findProductById.name);
    }
  }

  private handleError(
    error: HttpException | Error,
    functionName: string,
  ): void {
    switch (error.name) {
      case 'ProductNotFoundException': {
        throw error;
      }

      case 'ProductAlreadyExistsException': {
        throw error;
      }

      default: {
        throw new ServerErrorException(
          `An error occured within ${functionName}: ${error.message}`,
        );
      }
    }
  }
}
