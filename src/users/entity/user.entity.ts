import { IsDate, IsEmail, Length } from 'class-validator';
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
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => Wish, (wish) => wish.owner) // связь с подарками
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user) // связь с офферами
  offers: Offer[];

  @ManyToOne(() => WishList, (wishlist) => wishlist.user) // связь юзера с его вишлистами
  wishlists: WishList[];
}
