import {
  BadRequestException,
  Injectable,
  // NotFoundException,
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

  async createUser(createUserDto: CreateUserDto) {
    try {
      const userWithHash = await this.hashService.getUserData<CreateUserDto>(
        createUserDto,
      );
      return await this.usersRepository.save(userWithHash);
    } catch (err) {
      console.log(err);
    }
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

  async findMany(query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;

    const user = emailRegexp.test(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) {
      throw new Error(`Пользователь ${query} не найден`);
    }

    return [user];
  }
}
