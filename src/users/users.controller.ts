import {
  Controller,
  Get,
  Req,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entity/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getCurrentUser(@Req() req): Promise<User> {
    const currentUser = await this.usersService.findById(req.user.id);

    if (!currentUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return currentUser;
  }

  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return await this.wishesService.findUserWishes(req.user.id);
  }

  @Post('find')
  async findByQuery(@Body('query') query: string): Promise<User[]> {
    const user = await this.usersService.findMany(query);

    return user;
  }

  @Get(':username')
  async getUserData(@Param('username') username: string): Promise<User> {
    const userData = await this.usersService.findByUsername(username);

    if (!userData) {
      throw new NotFoundException('Пользователь не найден');
    }

    return userData;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return await this.wishesService.findUserWishes(id);
  }

  @Patch('me')
  async updateUserData(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
