import { Injectable } from '@nestjs/common';
import { VariantRepository } from './variant.repository';
import { VariantCreateDto, VariantDto, VariantUpdateDto } from './variant.dto';

@Injectable()
export class VariantService {
  constructor(private readonly variantRepo: VariantRepository) {}

  public async createVariant(variantCreateDto: VariantCreateDto) {
    const variant = await this.variantRepo.createVariant(variantCreateDto);

    return VariantDto.fromEntity(variant);
  }

  public async getVariant(id: string) {
    const variant = await this.variantRepo.getVariant(id);

    return VariantDto.fromEntity(variant);
  }

  public async getAllVariants() {
    const variants = await this.variantRepo.getVariants();

    const variantDtos = variants.map(VariantDto.fromEntity);

    return variantDtos;
  }

  public async updateVariant(id: string, variantUpdateDto: VariantUpdateDto) {
    const isUpdated = await this.variantRepo.updateVariant(
      id,
      variantUpdateDto,
    );

    return isUpdated;
  }

  public async deleteVariant(id: string) {
    const isDeleted = await this.variantRepo.deleteVariant(id);

    return isDeleted;
  }
}
