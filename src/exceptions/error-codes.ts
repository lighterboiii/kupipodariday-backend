import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UpdateError = 400,
  SaveError = 400,
  IncorrectData = 401,
  Forbidden = 403,
  DeleteForbidden = 403,
  OfferForbidden = 403,
  RaisedForbidden = 403,
  UserNotFound = 404,
  WishNotFound = 404,
  WishesNotFound = 404,
  WishlistNotFound = 404,
  UserAlreadyExists = 409,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.UpdateError, 'Ошибка обновления, некорректные данные'],
  [ErrorCode.SaveError, 'Ошибка сохранения данных'],
  [ErrorCode.IncorrectData, 'Некорректная пара логин и пароль'],
  [ErrorCode.Forbidden, 'Можно удалять только свои подарки'],
  [ErrorCode.DeleteForbidden, 'Можно удалять только свои списки подарков'],
  [ErrorCode.OfferForbidden, 'Нельзя вносить деньги на свои подарки'],
  [ErrorCode.RaisedForbidden, 'Слишком большая сумма поддержки'],
  [
    ErrorCode.UserAlreadyExists,
    'Пользователь с таким email или username уже зарегистрирован',
  ],
  [ErrorCode.UserNotFound, 'Пользователь не найден'],
  [ErrorCode.WishNotFound, 'Подарок не найден'],
  [ErrorCode.WishesNotFound, 'Подарки не найдены'],
  [ErrorCode.WishlistNotFound, 'Список подарков не найден'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.UpdateError, HttpStatus.BAD_REQUEST],
  [ErrorCode.SaveError, HttpStatus.BAD_REQUEST],
  [ErrorCode.IncorrectData, HttpStatus.UNAUTHORIZED],
  [ErrorCode.Forbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.OfferForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.DeleteForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.RaisedForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.UserAlreadyExists, HttpStatus.CONFLICT],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishesNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistNotFound, HttpStatus.NOT_FOUND],
]);
