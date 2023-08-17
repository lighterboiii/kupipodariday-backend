import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { HashService } from 'src/hash/hash.service';
import { ErrorCode } from 'src/exceptions/error-codes';
import { ServerException } from 'src/exceptions/server.exception';

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
      if (err instanceof QueryFailedError) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
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
      throw new ServerException(ErrorCode.UpdateError);
    }
    return this.findById(id);
  }

  async findMany(query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;

    const user = emailRegexp.test(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return [user];
  }

  async findWishes(id: number, relations: string[]) {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      relations,
    });

    if (!wishes) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    return wishes;
  }
}
