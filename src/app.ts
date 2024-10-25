import "reflect-metadata";
import { UserController } from "./controllers/user.controller";
import { PostController } from "./controllers/post.controller";
import { SongController } from "./controllers/song.controller";
import express from "express";
import { AppManager } from "./init/app.init";
import { connectDb } from "./mongoose/connect";
import { AuthController } from "./controllers/auth.controller";
import passport from "passport";

console.clear();
const appManager = new AppManager({
  controllers: [UserController, PostController, SongController, AuthController],
  middlewares: [
    express.json(),
    express.urlencoded({ extended: true }),
    passport.initialize(),
  ],
});

const uri = "mongodb://root:1234@localhost:27017";
const PORT = 3000;
(async () => {
  await connectDb(uri, "node");

  const app = appManager.initialize();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

// middleware -> guard -> handler -> interceptor -> error handler
