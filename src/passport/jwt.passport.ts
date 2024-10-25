import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import {
  Strategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SCRET_KEY!,
};

passport.use(
  new Strategy(options, (payload, done) => {
    return done(null, payload);
  })
);

export { passport };
