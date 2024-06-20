import { FilterQuery } from 'mongoose';

import { OrderModel } from '@order';
import { RequestParamsDto } from '@shared';
import { ProductModel } from '@product';

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
