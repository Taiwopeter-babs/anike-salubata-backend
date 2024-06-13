import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class VariantAlreadyExistsException extends BadRequestException {
  constructor(variantSize: number) {
    super(`Variant with the size: ${variantSize}, already exists`);
  }
}

export class CategoryAlreadyExistsException extends BadRequestException {
  constructor(categoryName: string) {
    super(`Category with the name: ${categoryName}, already exists`);
  }
}

export class ProductAlreadyExistsException extends BadRequestException {
  constructor(productName: string) {
    super(`Product with the name: ${productName}, already exists`);
  }
}
