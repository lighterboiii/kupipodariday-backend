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
import { User } from 'src/users/entity/user.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    console.log(req);
    return await this.wishesService.createWish(req.id, createWishDto);
  }

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
    return await this.wishesService.findWithUser(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() user: User, @Param(':id') id: string) {
    const userId = user.id;
    return await this.wishesService.copyWishToUser(userId, Number(id));
  }

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Param('id') wishId: number, @Req() req) {
    return this.wishesService.removeOne(wishId, req.id);
  }
}
