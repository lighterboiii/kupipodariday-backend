import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entity/offer.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAllOffers(): Promise<Offer[]> {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async getOffer(@Param('id') id: string): Promise<Offer> {
    return await this.offersService.findOne(Number(id));
  }

  @Post()
  async createOffer(
    @Req() user: User,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = user.id;
    return await this.offersService.createOffer(userId, createOfferDto);
  }
}
