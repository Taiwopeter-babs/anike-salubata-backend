import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VariantModel } from './variant.schema';
import { Model } from 'mongoose';
import {
  MongooseSerializerInterceptor,
  VariantAlreadyExistsException,
  VariantNotFoundException,
} from '@utils';

import { VariantCreateDto, VariantUpdateDto } from './variant.dto';

/**
 * The repository for the variant.
 * All the mongoose document type returned are converted to the `Variant` type class
 * by the interceptor.
 */
@UseInterceptors(MongooseSerializerInterceptor(VariantModel))
@Injectable()
export class VariantRepository {
  constructor(
    @InjectModel(VariantModel.name)
    private readonly variantModel: Model<VariantModel>,
  ) {}

  public async createVariant(variantDto: VariantCreateDto) {
    const isVariant = await this.findVariantBySize(variantDto.size);

    if (isVariant) {
      throw new VariantAlreadyExistsException(variantDto.size);
    }
    const variant = await this.variantModel.create(variantDto);

    return variant as VariantModel;
  }

  public async getVariant(variantId: string): Promise<VariantModel> {
    const variant = await this.findVariantById(variantId);

    return variant as VariantModel;
  }

  public async getVariants(): Promise<VariantModel[]> {
    const variants = await this.variantModel.find();

    return variants as VariantModel[];
  }

  public async updateVariant(id: string, variantDto: VariantUpdateDto) {
    await this.findVariantById(id);

    const result = await this.variantModel
      .updateOne({ _id: id }, { size: variantDto.size })
      .exec();

    return result.acknowledged;
  }

  public async deleteVariant(id: string) {
    await this.findVariantById(id);

    const result = await this.variantModel.deleteOne({ _id: id }).exec();

    return result.acknowledged;
  }

  private async findVariantBySize(size: number) {
    const variant = await this.variantModel.findOne({ size: size });

    return variant;
  }

  private async findVariantById(variantId: string) {
    const variant = await this.variantModel.findById(variantId).exec();

    if (!variant) {
      throw new VariantNotFoundException(variantId);
    }

    return variant;
  }
}
