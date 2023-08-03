import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createWish(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return await this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find();
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findLastWishes() {
    return await this.wishesRepository.find({
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTopWishes() {
    return await this.wishesRepository.find({
      relations: {
        owner: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async findUserWishes(id: number) {
    return await this.wishesRepository.find({
      where: {
        owner: {
          id,
        },
      },
    });
  }

  async copyWishToUser(wishId: number, userId: number): Promise<Wish> {
    const wishToCopy = await this.findOne(wishId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!wishToCopy) {
      throw new NotFoundException('Такого подарка не существует');
    }

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const copiedWish = {
      name: wishToCopy.name,
      link: wishToCopy.link,
      image: wishToCopy.image,
      price: wishToCopy.price,
    };
    wishToCopy.copied += 1;

    const newWish = await this.createWish(user, copiedWish);
    await this.wishesRepository.save(wishToCopy);
    await this.wishesRepository.save(newWish);

    return newWish;
  }

  async updateWish(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<void> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }

    if (wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя изменить описание подарка после начала сбора средств',
      );
    }

    if (wish.owner.id !== userId) {
      throw new UnauthorizedException('Ошибка доступа');
    }

    await this.wishesRepository.update(id, updateWishDto);
  }

  async removeOne(id: number): Promise<void> {
    const wishToDelete = this.findOne(id);

    if (!wishToDelete) {
      throw new NotFoundException('Такого подарка не существует');
    }

    await this.wishesRepository.delete(id);
  }
}
