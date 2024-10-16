import "reflect-metadata";
import { UserController } from "./controllers/user.controller";
import { PostController } from "./controllers/post.controller";
import { SongController } from "./controllers/song.controller";
import { createApp } from "./init/app.init";
import { reponseFormatterMiddleware } from "./middlewares/response-formatter.middleware";
import { authGuard } from "./guards/auth.guard";

const app = createApp({
  controllers: [UserController, PostController, SongController],
  prefix: ["/api", "/v1"],
  interceptors: [reponseFormatterMiddleware],
  guards: [authGuard],
});

// middleware -> guard -> handler -> interceptor -> error handler
