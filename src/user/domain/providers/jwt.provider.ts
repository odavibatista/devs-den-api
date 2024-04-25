import { JwtPayload } from 'jsonwebtoken'
import { JWTProviderDTO, JWTValidateDTO } from 'src/user/dto/JWTProvider.dto'

export interface JWTProviderInterface {
  generate(data: JWTProviderDTO): string
  validate(data: JWTValidateDTO): JwtPayload | string
}