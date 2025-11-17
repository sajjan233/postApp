import passportJwt from 'passport-jwt';
import passport from 'passport';
import User from '../fetchers/user/user.js'; // update path if needed
import dotenv from 'dotenv';
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    console.log("errr",err);
    
    return done(err, false);
  }
}));
