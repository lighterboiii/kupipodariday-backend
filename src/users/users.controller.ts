import {
  Controller,
  Get,
  Req,
  Body,
  Patch,
  Param,
  NotFoundException,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entity/wish.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getCurrentUser(@Req() user: User): Promise<User> {
    const currentUser = await this.usersService.findById(user.id);

    if (!currentUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return currentUser;
  }

  @Get('me/wishes')
  async findMyWishes(@Req() user: User): Promise<Wish[]> {
    const id = user.id;

    return await this.wishesService.findUserWishes(id);
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
    const userId = await this.usersService.findByUsername(username);
    return await this.wishesService.findUserWishes(Number(userId));
  }

  @Patch('me')
  async updateUserData(
    @Req() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(user.id, updateUserDto);
  }

  @Post('find')
  async findByQuery(@Body('query') query: string): Promise<User[]> {
    const user = await this.usersService.findMany(query);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.usersService.removeById(id);
  }
}
