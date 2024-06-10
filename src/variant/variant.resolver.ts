import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationResult, Variant } from './variant.graphql';
import { VariantService } from './variant.service';
import { VariantCreateDto, VariantDto, VariantUpdateDto } from './variant.dto';

@Resolver(() => Variant)
export class VariantResolver {
  constructor(private readonly variantService: VariantService) {}

  @Query(() => VariantDto)
  async getVariant(@Args('id') id: string) {
    const variant = await this.variantService.getVariant(id);

    return variant;
  }

  @Query(() => [VariantDto])
  async getAllVariants() {
    const variants = await this.variantService.getAllVariants();

    return variants;
  }

  @Mutation(() => [VariantDto])
  async createVariant(
    @Args('variant', { nullable: false }) variant: VariantCreateDto,
  ) {
    const newVariant = await this.variantService.createVariant(variant);

    return newVariant;
  }

  @Mutation(() => MutationResult)
  async updateVariant(
    @Args('id', { nullable: false }) id: string,
    @Args('variant', { nullable: false }) variant: VariantUpdateDto,
  ) {
    const isUpdated = await this.variantService.updateVariant(id, variant);

    return { success: isUpdated };
  }

  @Mutation(() => MutationResult)
  async deleteVariant(
    @Args('id', { nullable: false }) id: string,
    @Args('variant', { nullable: false }) variant: VariantUpdateDto,
  ) {
    const isDeleted = await this.variantService.updateVariant(id, variant);

    return { success: isDeleted };
  }
}
