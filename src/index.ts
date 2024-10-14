import "reflect-metadata";
import express, { Request, Response } from "express";
import { Container } from "./di/container.di";
import { UserController } from "./controllers/user.controller";
import { getControllers } from "./decorators/controller.decorator";
import { PostController } from "./controllers/post.controller";

const app = express();

const container = new Container();

const controllers = getControllers();
controllers.map((controller) => {
  container.register(controller);
});

const userController = container.get(UserController);
const postController = container.get(PostController);

app.get("/", (req: Request, res: Response) => {
  res.send(userController.getUser());
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
