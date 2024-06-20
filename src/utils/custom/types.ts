import { FilterQuery } from 'mongoose';
import { OrderModel } from '../order/order.schema';
import { RequestParamsDto } from '../shared/dataTransferObjects';
import { ProductModel } from '../product/product.schema';

export interface ICorsConfig {
  methods: string | string;
  origin: string | string[];
}

export interface IQueryParams {
  requestParams?: RequestParamsDto;
}

export interface IGetOrders extends IQueryParams {
  userId?: string;
}

export interface IOrderQuery extends IGetOrders {
  condition?: FilterQuery<OrderModel>;
}

export interface IProductQuery extends IQueryParams {
  condition?: FilterQuery<ProductModel>;
}
