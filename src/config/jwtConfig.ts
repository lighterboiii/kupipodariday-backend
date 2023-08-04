import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('jwt_secret'),
  signOptions: {
    expiresIn: '1d',
  },
});
