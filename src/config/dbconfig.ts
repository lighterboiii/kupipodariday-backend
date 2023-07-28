import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Wish } from '../wishes/entity/wish.entity';
import { WishList } from '../wishlists/entity/wishlist.entity';
import { Offer } from '../offers/entity/offer.entity';

export const createDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [User, Offer, Wish, WishList],
    synchronize: configService.get('POSTGRES_SYNCHRONIZE'),
  };
};
