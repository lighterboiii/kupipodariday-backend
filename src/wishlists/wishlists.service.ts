import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepository: Repository<WishList>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async createWishlist(
    user: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<WishList> {
    const wishList = this.wishlistsRepository.create({
      ...createWishlistDto,
      user: user,
    });
    return await this.wishlistsRepository.save(wishList);
  }

  async findOne(id: number): Promise<WishList> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        items: true,
      },
    });
    return wishlist;
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: {
        user: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishList> {
    const wishList = await this.findOne(id);
    const wishes = await this.wishesRepository.find({
      where: { id: In(updateWishlistDto.itemsId) },
    });

    if (!wishList) {
      throw new NotFoundException('Некорректные данные');
    }

    if (userId !== wishList.user.id) {
      throw new UnauthorizedException('Недостаточно прав');
    }

    return await this.wishlistsRepository.save({
      ...wishList,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes.concat(wishList.items),
    });
  }

  async removeOne(id: number): Promise<void> {
    const wishList = this.findOne(id);

    if (!wishList) {
      throw new NotFoundException('Некорректные данные');
    }

    await this.wishlistsRepository.delete(id);
  }
}
