import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MutationResult } from '@shared';

import { OrderCreateDto, OrderDto } from './order.dto';
import { OrderService } from './order.service';
import { OrderModel } from './order.schema';

import { ProductService, ProductDto } from '@product';

import { RequestParamsDto } from '@shared';

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
    @Args('newOrder', { nullable: false }) orderDto: OrderCreateDto,
  ) {
    const newOrder = await this.orderService.createOrder(orderDto);

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
