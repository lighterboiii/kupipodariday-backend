import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/createWish.dto';
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
    private readonly dataSource: DataSource,
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

  async copyWish(userId: number, wishId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, owner, ...wish } =
        await this.getWishById(wishId);
      const copiedWish = await this.createWish(userId, wish);
      await this.wishesRepository.update(wishId, {
        copied: copiedWish.copied + 1,
      });
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWishListByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();

    if (!wishes) {
      throw new NotFoundException('Такого подарка не найдено');
    }
    return wishes;
  }

  async update(userId: number, wishId: number, updateData: any) {
    const wish = await this.getWishById(wishId);

    if (updateData.hasOwnProperty('price') && wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя обновить стоимость после начала сбора средств',
      );
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Изменять можно только свой подарок');
    }

    const updatedWish = await this.wishesRepository.update(wishId, updateData);

    if (updatedWish.affected === 0) {
      throw new Error('Ошибка обновления');
    }
  }

  async updateRaised(id: number, updateData: any) {
    const wish = await this.wishesRepository.update(id, updateData);

    if (wish.affected === 0) {
      throw new Error('Ошибка обновления');
    }
  }

  async removeOne(wishId: number, userId: number): Promise<void> {
    const wish = await this.getWishById(wishId);

    if (userId !== wish.owner.id) {
      throw new NotFoundException('Вы можете удалять только свои подарки');
    }

    await this.wishesRepository.delete(wishId);
  }
}
