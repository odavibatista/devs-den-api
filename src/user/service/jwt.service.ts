import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
    constructor(
      ) {}

    public verifyToken (token: string, callbackfn: jwt.VerifyCallback) {
        jwt.verify(token, String(process.env.JWT_KEY), callbackfn);
      }
  
    public checkPassword (password: string, otherPassword: string, callbackfn: (err?: Error, isSame?: boolean) => void) {
        bcrypt.compare(password, otherPassword, (err, isSame) => {
          if (err) {
            callbackfn(err)
          } else {
            callbackfn(err, isSame)
          }
        });
    }

    public generateToken (payload: string | object | Buffer, expiration: string): string {
        console.log(process.env.JWT_KEY)
        return jwt.sign(payload, String(process.env.JWT_KEY), {
          expiresIn: expiration,
        });
    }
}
