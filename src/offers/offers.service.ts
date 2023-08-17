import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffer(userId: number, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.getWishById(createOfferDto.wishId);
      if (userId === wish.owner.id) {
        throw new ServerException(ErrorCode.OfferForbidden);
      }

      const user = await this.usersService.findById(wish.owner.id);
      const raisedSum = Number(
        (wish.raised + createOfferDto.amount).toFixed(2),
      );

      if (raisedSum > wish.price) {
        throw new ServerException(ErrorCode.RaisedForbidden);
      }

      await this.wishesService.updateRaised(createOfferDto.wishId, {
        raised: raisedSum,
      });

      const offer = await this.offersRepository.save({
        ...createOfferDto,
        wish,
        user,
      });
      await queryRunner.commitTransaction();
      delete wish.owner.password;
      delete user.password;
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
