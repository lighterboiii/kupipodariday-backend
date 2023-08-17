import { IsBoolean, IsNumber } from 'class-validator';
import { Column, ManyToOne, Entity } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { BaseEntity } from 'src/entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
