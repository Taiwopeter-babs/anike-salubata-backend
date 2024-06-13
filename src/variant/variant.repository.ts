import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Variant } from './variant.schema';
import { Model } from 'mongoose';
import MongooseSerializerInterceptor from '../utils/interceptors/mongoose.interceptor';
import { VariantCreateDto, VariantUpdateDto } from './variant.dto';
import { VariantNotFoundException } from '../utils/exceptions/notFound.exception';
import { VariantAlreadyExistsException } from '../utils/exceptions/badRequest.exception';

/**
 * The repository for the variant.
 * All the mongoose document type returned are converted to the `Variant` type class
 * by the interceptor.
 */
@UseInterceptors(MongooseSerializerInterceptor(Variant))
@Injectable()
export class VariantRepository {
  constructor(
    @InjectModel(Variant.name) private readonly variantModel: Model<Variant>,
  ) {}

  public async createVariant(variantDto: VariantCreateDto) {
    const isVariant = await this.findVariantBySize(variantDto.size);

    if (isVariant) {
      throw new VariantAlreadyExistsException(variantDto.size);
    }
    const variant = await this.variantModel.create(variantDto);

    return variant as Variant;
  }

  public async getVariant(variantId: string): Promise<Variant> {
    const variant = await this.findVariantById(variantId);

    return variant as Variant;
  }

  public async getVariants(): Promise<Variant[]> {
    const variants = await this.variantModel.find();

    return variants as Variant[];
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
