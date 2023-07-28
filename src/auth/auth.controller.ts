import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { User } from 'src/users/entity/user.entity';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    return this.authService.auth(user);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() req: Request & { user: User }) {
    return this.authService.auth(req.user);
  }
}
