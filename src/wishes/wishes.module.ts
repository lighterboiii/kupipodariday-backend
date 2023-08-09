import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entity/wish.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  providers: [WishesService, UsersService, HashService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
