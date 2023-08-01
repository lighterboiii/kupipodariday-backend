import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  // создание пользователя
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }
  // возвращает всех юзеров
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  // поиск по имени пользователя
  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }
  // поиск по емейлу
  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }
  // поиск по айди
  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: id },
    });
  }
  // обновление данных пользователя
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Ошибка. Пользователь с id: ${id} не найден`);
    }

    if (updateUserDto.email !== user.email) {
      const userExist = this.findByEmail(updateUserDto.email);

      if (userExist) {
        throw new BadRequestException(
          'Пользователь с такими данными уже существует',
        );
      }
    }

    if (updateUserDto.username !== user.username) {
      const userExist = this.findByUsername(updateUserDto.email);

      if (userExist) {
        throw new BadRequestException(
          'Пользователь с такими данными уже существует',
        );
      }
    }

    if (updateUserDto.password) {
      this.hashService.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
  // удаление по айди
  async removeById(id: number): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Ошибка. Пользователь не найден`);
    }

    await this.usersRepository.delete(id);
  }
}
