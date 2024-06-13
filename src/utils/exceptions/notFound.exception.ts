import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class VariantNotFoundException extends NotFoundException {
  constructor(variantId: string) {
    super(`Variant with the id: ${variantId}, was not found`);
  }
}

export class CategoryNotFoundException extends NotFoundException {
  constructor(categoryId: string) {
    super(`Category with the id: ${categoryId}, was not found`);
  }
}

export class ProductNotFoundException extends NotFoundException {
  constructor(productId: string) {
    super(`Product with the id: ${productId}, was not found`);
  }
}
