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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...createUserDto,
      password: await this.hashService.hashPassword(createUserDto.password),
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const newUserData = updateUserDto.hasOwnProperty('password')
      ? await this.hashService.getUserData<UpdateUserDto>(updateUserDto)
      : updateUserDto;
    const user = await this.usersRepository.update(id, newUserData);
    if (user.affected === 0) {
      throw new BadRequestException('Ошибка');
    }
    return this.findById(id);
  }

  async removeById(id: number): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`Ошибка. Пользователь не найден`);
    }

    await this.usersRepository.delete(id);
  }

  async findMany(query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;

    const user = emailRegexp.test(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) return null;

    return [user];
  }
}
