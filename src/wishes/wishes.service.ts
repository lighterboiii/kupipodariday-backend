import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
  // создание wish
  async createWish(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return await this.wishesRepository.save(wish);
  }
  // поиск по айди
  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }
  // поиск последних 40 желаний
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
  // поиск топ 20 желаний
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
  // копирование желания себе
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
  // изменения желания
  async updateWish(id: number, updateWishDto: UpdateWishDto): Promise<void> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }

    if (wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя изменить описание подарка после начала сбора средств',
      );
    }

    await this.wishesRepository.update(id, updateWishDto);
  }
  // удаления желания
  async removeOne(id: number): Promise<void> {
    const wishToDelete = this.findOne(id);

    if (!wishToDelete) {
      throw new NotFoundException('Такого подарка не существует');
    }

    await this.wishesRepository.delete(id);
  }
}
