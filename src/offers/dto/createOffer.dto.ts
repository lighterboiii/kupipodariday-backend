import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  readonly amount: number;

  @IsBoolean()
  @IsOptional()
  readonly hidden?: boolean;

  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly wishId: number;
}
