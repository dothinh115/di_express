import { NextFunction, Response } from "express";
import { UnAuthorizedException } from "../middlewares/handle-error.middleware";
import { AppMiddleware } from "../core/middlewares/base.middleware";
import { Request } from "../types/common.type";
import { IS_PUBLIC_METADAT_KEY } from "../utils/constants";
import { Injectable } from "../decorators/injectable.decorator";
import passport from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements AppMiddleware {
  constructor() {
    new JwtStrategy();
  }
  use(req: Request, res: Response, next: NextFunction) {
    const instance = req.context.instance;
    const handlerName = req.context.handlerName;
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_METADAT_KEY,
      instance.constructor.prototype,
      handlerName
    );
    if (isPublic) {
      return next();
    }
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (info) {
          next(new UnAuthorizedException());
        } else {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  }
}

class JwtStrategy extends Strategy {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SCRET_KEY!,
      },
      (payload: JwtPayload, done: VerifiedCallback) => {
        this.validate(payload, done);
      }
    );

    passport.use(this);
  }

  validate(payload: JwtPayload, done: VerifiedCallback) {
    done(null, payload);
  }
}
