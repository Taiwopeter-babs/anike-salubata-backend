import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ProductModule } from 'src/product/product.module';
import { OrderModel, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([{ name: OrderModel.name, schema: OrderSchema }]),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
