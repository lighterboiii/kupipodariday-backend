import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishesService } from 'src/wishes/wishes.service';

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

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.usersService.removeById(id);
  }
}
