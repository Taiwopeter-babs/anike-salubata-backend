import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MutationResult } from '../variant/variant.graphql';

import { OrderCreateDto, OrderDto } from './order.dto';
import { OrderService } from './order.service';

import { ProductDto } from '../product/product.dto';
import { ProductService } from '../product/product.service';

import { RequestParamsDto } from 'src/shared/dataTransferObjects';
import { OrderModel } from './order.schema';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly prodService: ProductService,
  ) {}

  @Query(() => OrderDto, { name: 'order' })
  async getOrder(@Args('id') id: string) {
    const order = await this.orderService.getOrder(id);

    return order;
  }

  @Query(() => OrderDto, { name: 'orderByTrackingId' })
  async getOrderByTrackingId(@Args('trackingId') trackingId: string) {
    const order = await this.orderService.getOrderByTrackingId(trackingId);

    return order;
  }

  @Query(() => [OrderDto], { name: 'orders' })
  async getOrders(
    @Args('orderParameters', { nullable: true })
    orderParams: RequestParamsDto,
  ) {
    const orders = await this.orderService.getOrders({
      requestParams: orderParams,
    });

    return orders;
  }

  @Mutation(() => OrderDto, { name: 'order' })
  async createOrder(
    @Args('newOrder', { nullable: false }) order: OrderCreateDto,
  ) {
    const newOrder = await this.orderService.createOrder(order);

    return newOrder;
  }

  @Mutation(() => MutationResult, { name: 'deleteOrder' })
  async deleteOrder(@Args('id', { nullable: false }) id: string) {
    const isDeleted = await this.orderService.deleteOrder(id);

    return { success: isDeleted };
  }

  @ResolveField(() => [ProductDto], { nullable: false })
  async products(@Parent() order: OrderModel) {
    const { products } = order;

    const orderProducts: ProductDto[] =
      await this.prodService.getProductsFromIdArray(products);

    return orderProducts;
  }
}
