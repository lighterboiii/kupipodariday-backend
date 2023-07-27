import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
