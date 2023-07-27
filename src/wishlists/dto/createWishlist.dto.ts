import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsString()
  @Max(1500)
  description?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
