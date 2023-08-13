import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entity/wish.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTopWishes();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLastWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(
    @Req() { user: { id } },
    @Param('id') wishId: number,
  ): Promise<Wish> {
    return await this.wishesService.getWishInfo(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user: { id } },
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    console.log(id);
    return await this.wishesService.createWish(id, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() { user: { id } }, @Param(':id') wishId: string) {
    return await this.wishesService.copyWishToUser(+wishId, id);
  }

  // @UseGuards(JwtGuard)
  // @Patch(':id')
  // async updateWish(
  //   @Param(':id') wishId: string,
  //   @Body() updateWishDto: UpdateWishDto,
  //   @Req() { user: { id } },
  // ): Promise<void> {
  //   return await this.wishesService.updateWish(+wishId, updateWishDto, id);
  // }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Param('id') wishId: number, @Req() { user: { id } }) {
    return this.wishesService.removeOne(wishId, id);
  }
}
