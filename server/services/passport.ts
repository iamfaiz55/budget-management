import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";

dotenv.config();

// 🔐 JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY as string,
    },
    async (jwtPayload: JwtPayload, done) => {
      try {
        return done(null, jwtPayload);
      } catch (error) {
        done(error, false);
      }
    }
  )
);




export default passport;
