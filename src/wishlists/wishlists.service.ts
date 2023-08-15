import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepository: Repository<WishList>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });

    if (!wishlists) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlists;
  }

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { itemsId, ...rest } = createWishlistDto;

      const items = await this.wishesService.getWishListByIds(itemsId);
      const owner = await this.usersService.findById(userId);

      const wishList = await this.wishlistsRepository.save({
        ...rest,
        items,
        owner,
      });
      await queryRunner.commitTransaction();
      return wishList;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  async removeOne(userId: number, wishListId: number) {
    const wishlist = await this.findOne(wishListId);

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Удалять можно только свои коллекции');
    }

    return await this.wishlistsRepository.delete(wishListId);
  }
}
