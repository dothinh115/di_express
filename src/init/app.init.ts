import express, { Request, Response } from "express";
import { Container } from "../di/container.di";
import { registerRoutes } from "../routes/register.route";
import { handleErrorMiddleware } from "../middlewares/handle-error.middleware";
import { reponseFormatterMiddleware } from "../middlewares/response-formatter.middleware";

type TCreateApp = {
  controllers?: any[];
  prefix?: string[];
  interceptors?: any[];
  middlewares?: any[];
  guards?: any[];
};

export const createApp = ({
  controllers = [],
  prefix = [],
  interceptors,
  middlewares,
  guards,
}: TCreateApp) => {
  const app = express();

  const container = new Container();

  const instances = controllers.map((controller) => {
    container.register(controller);
    return container.get(controller);
  });

  // console.clear();

  if (middlewares && middlewares.length > 0) {
    app.use(...middlewares);
  }

  if (guards && guards.length > 0) {
    app.use(...guards);
  }

  instances.map((instance) => {
    const router = registerRoutes(instance, prefix);
    app.use(router);
  });

  if (interceptors && interceptors.length > 0) {
    app.use(...interceptors);
  }

  app.use(reponseFormatterMiddleware);
  app.use(handleErrorMiddleware);

  app.use((req: Request, res: Response) => {
    res.status(404).send({
      statusCode: 404,
      message: "Not Found",
    });
  });

  return app;
};
