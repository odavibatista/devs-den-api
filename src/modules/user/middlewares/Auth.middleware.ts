import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { JWTProvider } from '../providers/JWT.provider'
import { NotAuthenticatedException } from '../domain/errors/NotAuthenticated.exception'
import { JwtPayload } from 'jsonwebtoken'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtProvider: JWTProvider,
  ) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization

    if (authHeaders) {
      const token = authHeaders.replace(/Bearer /, '')

      const decoded = this.jwtProvider.validate({token, secret: String(process.env.JWT_KEY)})

      const { id, role } = (decoded as JwtPayload)

      req.user = {
        id,
        role
      }

      next();

    } else {
      throw new NotAuthenticatedException()
    }

  }
}