import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '@product';
import { CategoryModule } from '@category';
import { VariantModule } from '@variant';

import configuration from './utils/custom/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CustomStringScalar } from './utils/custom/customScalars';
import { GraphQLFormattedError } from 'graphql';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    // CONFIG MODULE
    ConfigModule.forRoot({
      load: [configuration],

      cache: true,

      isGlobal: true,
    }),

    // MONGOOSE MODULE
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DATABASE'),
        autoIndex: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // GRAPHQL MODULE
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,

      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

        playground: configService.get<string>('NODE_ENV') === 'development',

        sortSchema: true,

        resolvers: { GraphQLString: CustomStringScalar },

        // format graphql error
        formatError: (error) => {
          const originalError = error.extensions
            ?.originalError as unknown as GraphQLFormattedError | null;

          if (originalError !== null) {
            return {
              message: error.message,
              error: originalError?.message,
              code: error.extensions?.code,
            };
          }

          return {
            message: error.message,
            path: error.path,
          };
        },
      }),
    }),
    ProductModule,
    CategoryModule,
    VariantModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
