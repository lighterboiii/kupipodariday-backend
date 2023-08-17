import { HttpException, HttpStatus } from '@nestjs/common';
import { code2message, code2status, ErrorCode } from './error-codes';

export class ServerException extends HttpException {
  public code: ErrorCode;

  constructor(code: ErrorCode) {
    super(
      code2message.get(code) ||
        'Ошибка сервера, повторите запрос или попробуйте позднее',
      code2status.get(code) || HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.code = code;
  }
}
