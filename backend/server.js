import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import userModel from "./models/userModel.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import { registerNewUser,createToken } from "./controllers/userController.js";


dotenv.config();

const baseUrl= process.env.FRONTEND_URL;
const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB config
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// Middleware
app.use(cors({ origin: ["http://localhost:3000",baseUrl], credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// === Passport Google OAuth Config ===
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json;

    try {
      let user = await userModel.findOne({ email });

      if (!user) {
        user = await registerNewUser({ name, email, password: "randomPass123!" }); // dummy password
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${baseUrl}/login` }),
  (req, res) => {
    const token = createToken(req.user._id);
    
    res.redirect(`${baseUrl}/oauth-success?token=${token}`);
  }
);

// API Routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// Start server
app.listen(PORT, () => console.log(`Server running ....`));
