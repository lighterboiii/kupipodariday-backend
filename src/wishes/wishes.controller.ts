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
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entity/wish.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createWish(
    @Req() userId: number,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.createWish(userId, createWishDto);
  }

  @Get(':id')
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findOne(Number(id));
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTopWishes();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLastWishes();
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(@Req() user: User, @Param(':id') id: string) {
    const userId = user.id;
    return await this.wishesService.copyWishToUser(userId, Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  async deleteWish() {
    return 'Метод удаления желания';
  }
}
