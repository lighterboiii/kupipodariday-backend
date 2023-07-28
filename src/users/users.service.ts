import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
  // обновления данных пользователя
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Ошибка. Пользователь с id: ${id} не найден`);
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
