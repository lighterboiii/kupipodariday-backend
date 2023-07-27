import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  name?: string;

  @IsString()
  link?: string;

  @IsUrl()
  image?: string;

  @IsNumber()
  price?: number;
}
