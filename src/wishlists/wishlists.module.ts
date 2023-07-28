import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entity/wishlist.entity';
import { Wish } from 'src/wishes/entity/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList, Wish])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
