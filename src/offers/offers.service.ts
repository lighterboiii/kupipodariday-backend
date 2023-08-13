import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { Wish } from 'src/wishes/entity/wish.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createOffer(userId: number, createOfferDto: CreateOfferDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const wish = await this.wishesRepository.findOne({
      where: { id: createOfferDto.wishId },
      relations: {
        owner: true,
      },
    });

    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Вы не можете участвовать в сборе на свой подарок',
      );
    }

    const newAmount = wish.raised + createOfferDto.amount;

    if (newAmount > wish.price) {
      throw new BadRequestException('Сумма вклада превышает его стоимость');
    }

    const createdOffer = this.offersRepository.create({
      amount: createOfferDto.amount,
      user,
    });

    await this.offersRepository.save(createdOffer);

    wish.raised = newAmount;
    wish.offers.push(createdOffer);
    await this.wishesRepository.save(wish);

    return createdOffer;
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offersRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });
  }
}
