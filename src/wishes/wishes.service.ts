import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.usersService.findById(userId);
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: rest,
    });
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Некорректные данные');
    }

    return wish;
  }

  async getWishInfo(userId: number, id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException('Некорректные данные');
    }

    if (userId === wish.owner.id) {
      return wish;
    } else {
      const filteredOffers = wish.offers.filter((offer) => !offer.hidden);
      wish.offers = filteredOffers;
      return wish;
    }
  }

  async findLastWishes() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    if (!wishes) {
      throw new NotFoundException('Не найдено');
    }

    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    if (!wishes) {
      throw new NotFoundException('Не найдено');
    }

    return wishes;
  }

  async findUserWishes(id: number) {
    const { wishes } = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return wishes;
    // return await this.wishesRepository.find({
    //   where: {
    //     owner: {
    //       id,
    //     },
    //   },
    // });
  }

  async copyWishToUser(userId: number, wishId: number): Promise<Wish> {
    const wishToCopy = await this.getWishById(wishId);
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

    const newWish = await this.createWish(user.id, copiedWish);
    await this.wishesRepository.save(wishToCopy);
    await this.wishesRepository.save(newWish);

    return newWish;
  }

  // async updateWish(
  //   id: number,
  //   updateWishDto: UpdateWishDto,
  //   userId: number,
  // ): Promise<void> {
  //   const wish = await this.getWishById(id);

  //   if (!wish) {
  //     throw new NotFoundException('Такого подарка не существует');
  //   }

  //   if (wish.raised > 0) {
  //     throw new BadRequestException(
  //       'Нельзя изменить описание подарка после начала сбора средств',
  //     );
  //   }

  //   if (wish.owner.id !== userId) {
  //     throw new UnauthorizedException('Ошибка доступа');
  //   }

  //   await this.wishesRepository.update(id, updateWishDto);
  // }

  async removeOne(wishId: number, userId: number): Promise<void> {
    const wish = await this.getWishById(wishId);

    if (userId !== wish.owner.id) {
      throw new NotFoundException('Вы можете удалять только свои подарки');
    }

    await this.wishesRepository.delete(wishId);
  }
}
