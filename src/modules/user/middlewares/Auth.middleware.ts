import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { JWTProvider } from '../providers/JWT.provider'
import { BadTokenException } from '../domain/errors/BadToken.exception'
import { NotAuthenticatedException } from '../domain/errors/NotAuthenticated.exception'
import { IGetUserAuthInfoRequest } from 'src/shared/utils/IGetUserAuthInfoRequest'
import { UserService } from '../service/user.service'
import { JwtPayload } from 'jsonwebtoken'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtProvider: JWTProvider,
    private userService: UserService
  ) {}
  async use(req: IGetUserAuthInfoRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      throw new NotAuthenticatedException()
    }
    
    const [, token] = authHeader.split(' ')
    
    try {
      const decoded = this.jwtProvider.validate({
        token,
        secret: String(process.env.JWT_KEY),
      })

      const { id, role } = decoded as JwtPayload

      req.user = {
        id,
        role
      }

      return next()
    } catch (error) {
      throw new BadTokenException()
    }
  }
}