import { IsDate, IsNumber, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entity/offer.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  price: number;

  @Column()
  @IsNumber()
  raised: number;

  @Column()
  @IsUrl()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: [];

  @Column()
  @IsNumber()
  copied: number;
}
