import {
  Controller,
  Get,
  Req,
  Body,
  Patch,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entity/wish.entity';
import { UserWishesDto } from './dto/user-wishes.dto';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

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
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return currentUser;
  }

  @Get('me/wishes')
  async findCurrentUserWishes(@Req() { user: { id } }): Promise<Wish[]> {
    const relations = ['wishes', 'wishes.owner', 'wishes.offers'];
    return await this.usersService.findWishes(id, relations);
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
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return userData;
  }

  @Get(':username/wishes')
  async findUserWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const { id } = await this.usersService.findByUsername(username);
    const relations = ['wishes', 'wishes.owner', 'wishes.offers'];
    return await this.usersService.findWishes(id, relations);
  }

  @Patch('me')
  async updateUserData(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
