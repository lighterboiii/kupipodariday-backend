import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    @InjectRepository(WishList)
    private wishlistsRepository: Repository<WishList>,
    private readonly wishlistsService: WishlistsService,
  ) {}

  @Get()
  async getAll(): Promise<WishList[]> {
    return await this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Req() { user: { id } },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishList> {
    return await this.wishlistsService.createWishlist(id, createWishlistDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<WishList> {
    const wishList = this.wishlistsService.findOne(id);

    if (!wishList) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishList;
  }
}
