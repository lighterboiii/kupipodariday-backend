import { IsDate, Length, IsUrl, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;
}
