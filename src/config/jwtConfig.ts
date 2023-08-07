import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

// export default (configService: ConfigService): JwtModuleOptions => ({
//   secret: configService.get<string>('jwt_secret'),
//   signOptions: {
//     expiresIn: '1d',
//   },
// });
@Injectable()
export default class JWTConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: '1d',
      },
    };
  }
}
