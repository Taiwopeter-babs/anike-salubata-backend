import { Injectable } from '@nestjs/common';

import { OrderRepository } from './order.repository';
import { OrderCreateDto, OrderDto } from './order.dto';
import { OrderModel } from './order.schema';
import { IGetOrders, IOrderQuery } from 'src/utils/types';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  public async createOrder(orderCreateDto: OrderCreateDto) {
    const order = (await this.orderRepo.createOrder(
      orderCreateDto,
    )) as OrderModel;

    return OrderDto.fromEntity(order);
  }

  public async getOrder(id: string) {
    const order = await this.orderRepo.getOrder(id);

    return OrderDto.fromEntity(order);
  }

  public async getOrderByTrackingId(trackingId: string) {
    const order = await this.orderRepo.getOrderByTrackingId(trackingId);

    return OrderDto.fromEntity(order);
  }

  public async getOrders(orderParams?: IGetOrders) {
    const orders = (await this.orderRepo.getOrdersByParams(
      orderParams,
    )) as OrderModel[];

    const ordertDtos = orders.map(OrderDto.fromEntity);

    return ordertDtos;
  }

  public async getOrdersByCondition(params?: IOrderQuery) {
    const orders = (await this.orderRepo.getOrdersByParams(
      params,
    )) as OrderModel[];

    const ordertDtos = orders.map(OrderDto.fromEntity);

    return ordertDtos;
  }

  public async deleteOrder(id: string) {
    const isDeleted = await this.orderRepo.deleteOrder(id);

    return isDeleted;
  }
}
