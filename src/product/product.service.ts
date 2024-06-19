import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductCreateDto, ProductDto, ProductUpdateDto } from './product.dto';
import { ProductModel } from './product.schema';
import { RequestParamsDto } from '../shared/dataTransferObjects';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  public async createProduct(productCreateDto: ProductCreateDto) {
    const product = (await this.productRepo.createProduct(
      productCreateDto,
    )) as ProductModel;

    return ProductDto.fromEntity(product);
  }

  public async getProduct(id: string) {
    const product = await this.productRepo.getProduct(id);

    return ProductDto.fromEntity(product);
  }

  public async getProducts(productParams: RequestParamsDto | null) {
    const products = (await this.productRepo.getProducts(
      productParams,
    )) as ProductModel[];

    const productDtos = products.map(ProductDto.fromEntity);

    return productDtos;
  }

  public async updateProduct(id: string, productUpdateDto: ProductUpdateDto) {
    const isUpdated = await this.productRepo.updateProduct(
      id,
      productUpdateDto,
    );

    return isUpdated;
  }

  public async deleteProduct(id: string) {
    const isDeleted = await this.productRepo.deleteProduct(id);

    return isDeleted;
  }
}
