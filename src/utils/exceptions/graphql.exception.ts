import { ArgumentsHost, HttpException, Catch } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
export class GrapqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const gqlHost = GqlArgumentsHost.create(host);

    return exception;
  }
}
