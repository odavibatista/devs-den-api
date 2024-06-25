import { CityTooLongException } from '../../modules/address/domain/errors/CityTooLong.exception';
import { CityTooShortException } from '../../modules/address/domain/errors/CityTooShort.exception';
import { UnprocessableDataException } from '../domain/errors/UnprocessableData.exception';
import { cepValidate } from './cepValidate';
import { complementValidate } from './complementValidate';
import { nameValidate } from './nameValidate';
import { numberValidate } from './numberValidate';
import { streetValidate } from './streetValidate';

export interface IAddressObject    {
    uf: number
    city: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
}

export const addressValidate = (address: IAddressObject): boolean => {
  if (!nameValidate(address.city))
    throw new UnprocessableDataException(
      'Cidades devem possuir entre 3 e 50 caracteres e não podem conter números e caracteres especiais.',
    );

  if (!streetValidate(address.street))
    throw new UnprocessableDataException(
      'Ruas devem possuir entre 1 e 100 caracteres e não podem conter caracteres especiais.',
    );

    if (!numberValidate(address.number))
    throw new UnprocessableDataException(
      'Número de endereço deve possuir entre 1 e 6 caracteres e não podem conter letras ou caracteres especiais.',
    );

  if (!cepValidate(address.cep))
    throw new UnprocessableDataException('CEP inválido.');

  if (address.city.length < 3) throw new CityTooShortException();

  if (address.city.length > 50) throw new CityTooLongException();

  if (address.city.length < 1)
    throw new UnprocessableDataException(
      'Rua deve possuir pelo menos um caractere.',
    );

  if (address.city.length > 100)
    throw new UnprocessableDataException(
      'Rua não pode ter mais de 100 caracteres.',
    );

  if (address.number.length < 1)
    throw new UnprocessableDataException(
      'Número de endereço deve possuir pelo menos um caractere.',
    );

  if (address.number.length > 10)
    throw new UnprocessableDataException(
      'Número de endereço deve possuir no máximo dez caracteres.',
    );

    if (address.complement && address.complement.length > 100)
    throw new UnprocessableDataException(
      'Complemento não pode ter mais de 100 caracteres.',
    );

    if (!complementValidate(address.complement))
    throw new UnprocessableDataException(
      'Complemento não pode conter caracteres especiais.',
    );

  else return true;
};
