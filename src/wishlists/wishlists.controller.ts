import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishOwnerInterceptor } from 'src/interceptors/wish-owner.interceptor';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseInterceptors(WishOwnerInterceptor)
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

  @UseInterceptors(WishOwnerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<WishList> {
    return this.wishlistsService.findOne(id);
  }
}
