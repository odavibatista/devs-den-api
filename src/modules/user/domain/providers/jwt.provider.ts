import { JwtPayload } from 'jsonwebtoken';
import {
  JWTProviderDTO,
  JWTValidateDTO,
} from 'src/modules/user/dto/JWTProvider.dto';

export interface JWTProviderInterface {
  generate(data: JWTProviderDTO): string;
  validate(data: JWTValidateDTO): JwtPayload | string;
}
