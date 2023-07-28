import { IsDate, IsEmail, IsOptional, Length } from 'class-validator';
import { Offer } from 'src/offers/entity/offer.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { WishList } from 'src/wishlists/entity/wishlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  about: string;

  @Column()
  password: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @ManyToOne(() => WishList, (wishlist) => wishlist.user)
  wishlists: WishList[];
}
