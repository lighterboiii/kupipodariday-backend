import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  NotFoundException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entity/wish.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get()
  async getAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAll();
  }

  @Post()
  async createWish(
    @Req() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.createWish(user, createWishDto);
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    const wish = await this.wishesService.findOne(id);

    if (!wish) {
      throw new NotFoundException('Некорректные данные');
    }

    return wish;
  }

  @Get('/top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTopWishes();
  }

  @Get('/last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLastWishes();
  }

  @Post(':id/copy')
  async copyWish(@Req() user: User, @Param(':id') id: string) {
    const userId = user.id;
    return await this.wishesService.copyWishToUser(userId, Number(id));
  }

  @Patch(':id')
  async updateWish(
    @Param(':id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() user: User,
  ): Promise<void> {
    const userId = user.id;
    return await this.wishesService.updateWish(
      Number(id),
      updateWishDto,
      userId,
    );
  }

  @Delete(':id')
  async deleteWish(@Param(':id') id: string) {
    return await this.wishesService.removeOne(Number(id));
  }
}
