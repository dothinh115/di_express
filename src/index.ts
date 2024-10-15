import "reflect-metadata";
import express, { Request, Response } from "express";
import { Container } from "./di/container.di";
import { UserController } from "./controllers/user.controller";
import { PostController } from "./controllers/post.controller";
import { getRoutes } from "./decorators/method.decorator";
import { getControllerPath } from "./decorators/controller.decorator";
import { combinePaths } from "./utils/common";
import { Method } from "./types/method.type";
import { SongController } from "./controllers/song.controller";

const app = express();
const container = new Container();
const controllers = [UserController, PostController, SongController];

const instances = controllers.map((controller) => {
  container.register(controller);
  return container.get(controller);
});

instances.map((instance) => {
  const routes = getRoutes(instance.constructor);
  if (routes.length > 0) {
    const controllerPath = getControllerPath(instance.constructor); // /user
    routes.map((route) => {
      const path = combinePaths(controllerPath, route.path);
      switch (route.method) {
        case Method.GET: {
          app.get(path, (req: Request, res: Response) => {
            const result = (
              instance[route.handler as keyof typeof instance] as Function
            )(req, res);
            res.send(result);
          });
          break;
        }
        case Method.POST: {
          app.post(path, (req: Request, res: Response) => {
            const result = (
              instance[route.handler as keyof typeof instance] as Function
            )(req, res);
            res.send(result);
          });
          break;
        }
      }
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
