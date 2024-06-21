import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VariantModel, VariantSchema } from './variant.schema';
import { VariantRepository } from './variant.repository';
import { VariantService } from './variant.service';
import { VariantResolver } from './variant.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VariantModel.name, schema: VariantSchema },
    ]),
  ],
  providers: [VariantRepository, VariantService, VariantResolver],
})
export class VariantModule {}
