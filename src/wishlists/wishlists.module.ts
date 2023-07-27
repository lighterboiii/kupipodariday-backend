import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entity/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
