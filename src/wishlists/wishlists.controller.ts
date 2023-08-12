import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { User } from 'src/users/entity/user.entity';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishListsService: WishlistsService) {}

  @Get()
  async getAllWishes(): Promise<WishList[]> {
    return await this.wishListsService.findAll();
  }

  @Post()
  async createWishList(
    @Req() user: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishList> {
    return this.wishListsService.createWishlist(user, createWishlistDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<WishList> {
    const wishList = this.wishListsService.findOne(id);

    if (!wishList) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishList;
  }

  @Patch(':id')
  async updateWishlist(
    @Param('id') id: number,
    @Req() user: User,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishList> {
    const userId = user.id;
    return await this.wishListsService.update(userId, id, updateWishlistDto);
  }

  @Delete(':id')
  async deleteWishlist(@Param('id') id: number): Promise<void> {
    return await this.wishListsService.removeOne(id);
  }
}
