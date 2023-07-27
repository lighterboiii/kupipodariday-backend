import { IsDate, Max, Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export class WishList {
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
  @Max(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  items: [];

  @Column()
  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;
}
