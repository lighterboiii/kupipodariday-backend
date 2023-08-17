import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const userId = req.user.id;
    return await this.offersService.createOffer(userId, createOfferDto);
  }
}
