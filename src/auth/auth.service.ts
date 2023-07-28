import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(user: User): Promise<any> {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Неверный логин или пароль'); // заменить
    }

    const verified = await this.hashService.verifyPassword(
      password,
      user.password,
    );

    if (!verified) {
      throw new NotFoundException('Неверный логин или пароль'); // заменить
    }
  }
}
