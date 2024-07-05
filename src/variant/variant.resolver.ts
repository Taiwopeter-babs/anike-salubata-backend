import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Variant } from './variant.graphql';
import { VariantService } from './variant.service';
import { VariantCreateDto, VariantDto, VariantUpdateDto } from './variant.dto';

import { MutationResult } from '@shared';

@Resolver(() => Variant)
export class VariantResolver {
  constructor(private readonly variantService: VariantService) {}

  @Query(() => VariantDto, { name: 'variant' })
  async getVariant(@Args('id') id: string) {
    const variant = await this.variantService.getVariant(id);

    return variant;
  }

  @Query(() => [VariantDto], { name: 'variants' })
  async getAllVariants() {
    const variants = await this.variantService.getAllVariants();

    return variants;
  }

  @Mutation(() => VariantDto, { name: 'variant' })
  async createVariant(
    @Args('newVariant', { nullable: false }) variant: VariantCreateDto,
  ) {
    const newVariant = await this.variantService.createVariant(variant);

    return newVariant;
  }

  @Mutation(() => MutationResult, { name: 'updateVariant' })
  async updateVariant(
    @Args('id', { nullable: false }) id: string,
    @Args('variant', { nullable: false }) variant: VariantUpdateDto,
  ) {
    const isUpdated = await this.variantService.updateVariant(id, variant);

    return { success: isUpdated };
  }

  @Mutation(() => MutationResult, { name: 'deleteVariant' })
  async deleteVariant(@Args('id', { nullable: false }) id: string) {
    const isDeleted = await this.variantService.deleteVariant(id);

    return { success: isDeleted };
  }
}
