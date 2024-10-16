import express from "express";
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

  console.clear();
  instances.map((instance) => {
    const router = registerRoutes(instance, prefix);
    app.use([
      ...(middlewares ?? []),
      ...(guards ?? []),
      router,
      ...(interceptors ?? []),
      reponseFormatterMiddleware,
      handleErrorMiddleware,
    ]);
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return app;
};
