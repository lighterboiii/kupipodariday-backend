import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';

export class CreateOfferDto extends BaseEntity {
  @IsNumber()
  @Min(1)
  readonly amount: number;

  @IsBoolean()
  @IsOptional()
  readonly hidden?: boolean;

  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly wishId: number;
}
