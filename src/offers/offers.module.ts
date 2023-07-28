import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish, User])],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
