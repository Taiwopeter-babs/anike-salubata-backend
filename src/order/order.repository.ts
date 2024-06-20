import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';

import {
  OrderNotFoundException,
  ServerErrorException,
  IOrderQuery,
  getPageParams,
  MongooseSerializerInterceptor,
} from '@utils';

import { OrderModel } from './order.schema';
import { OrderCreateDto } from './order.dto';

/**
 * The repository for the Product.
 * All the mongoose document type returned are converted to the `Product` type class
 * by the interceptor.
 */
@UseInterceptors(MongooseSerializerInterceptor(OrderModel))
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderModel.name)
    private readonly orderModel: Model<OrderModel>,
  ) {}

  public async createOrder(orderDto: OrderCreateDto) {
    try {
      const orderObject = {
        userId: orderDto.userId,

        products: orderDto.products,

        trackingId: this.generateTrackingId(),
      } as OrderModel;

      const order = await this.orderModel.create(orderObject);

      return order as OrderModel;
    } catch (error) {
      throw error;
    }
  }

  public async getOrder(orderId: string): Promise<OrderModel> {
    const order = await this.findOrderById(orderId);

    return order as OrderModel;
  }

  public async getOrderByTrackingId(trackingId: string): Promise<OrderModel> {
    const order = await this.findOrderByCondition({ trackingId: trackingId });

    return order as OrderModel;
  }

  public async deleteOrder(id: string) {
    try {
      await this.findOrderById(id);

      const result = await this.orderModel.deleteOne({ _id: id }).exec();

      return result.acknowledged;
    } catch (error) {
      throw error;
    }
  }

  public async getOrdersByParams(
    params?: IOrderQuery,
  ): Promise<OrderModel[] | void> {
    try {
      const { userId, requestParams, condition } = params ?? {};

      const searchString = requestParams ? requestParams.searchString : '';

      const pageParams = getPageParams(requestParams);

      const filter: FilterQuery<OrderModel> = userId ? { userId: userId } : {};

      // Add condition
      if (condition) {
        filter.assign(condition);
      }

      // Add search
      if (searchString) {
        filter.$text = { $search: searchString };
      }

      const findQuery = this.orderModel
        .find(filter)
        .sort({ _id: 1 })
        .skip(pageParams.skip)
        .limit(pageParams.pageSize);

      const products = await findQuery;

      return products as OrderModel[];
    } catch (error) {
      throw new ServerErrorException(
        `An error occured within ${this.getOrdersByParams.name}: ${error.message}`,
      );
    }
  }

  private async findOrderByCondition(condition: FilterQuery<OrderModel>) {
    try {
      const order = await this.orderModel.findOne(condition).exec();

      return order;
    } catch (error) {
      throw new ServerErrorException(
        `An error occured within ${this.findOrderByCondition.name}: ${error.message}`,
      );
    }
  }

  private async findOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId).exec();

      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      return order;
    } catch (error) {
      if (error.name === 'OrderNotFoundException') {
        throw error;
      }

      throw new ServerErrorException(
        `An error occured within ${this.findOrderById.name}: ${error.message}`,
      );
    }
  }

  /**
   * A random string of format `ANSA_<string>`. The unqiueness of
   * the result is highly probable because the probablity that there will
   * be a collision for the current date and time millisecond is low.
   */
  private generateTrackingId(): string {
    let result = '';
    const currentDate = new Date();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let count = 0;

    while (count < 24) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      count += 1;
    }

    return `ANSA_${currentDate.getUTCMilliseconds()}${result}`;
  }
}
