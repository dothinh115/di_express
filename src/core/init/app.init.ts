import express, { Application, Request, Response } from "express";
import { registerRoutes } from "../routes/register.route";
import * as dotenv from "dotenv";
import { Container } from "../di/container.di";
import { ResponseFormatterMiddleware } from "../../middlewares/response-formatter.middleware";
import { HandleErrorMiddleware } from "../../middlewares/handle-error.middleware";
import { Handle404Middleware } from "../../middlewares/handle-404.middleware";
import { ExcuteHandlerMiddleware } from "../middlewares/handler.middleware";

type TCreateApp = {
  controllers: any[];
  prefix?: string[];
  interceptors?: any[];
  middlewares?: any[];
  guards?: any[];
};

export class AppManager {
  controllers: any[];
  prefix?: string[];
  interceptors?: any[];
  middlewares?: any[];
  guards?: any[];
  app: Application;
  container: Container;
  instances: any[];
  constructor({
    controllers = [],
    prefix = [],
    interceptors,
    middlewares,
    guards,
  }: TCreateApp) {
    this.controllers = controllers;
    this.prefix = prefix;
    this.interceptors = interceptors;
    this.middlewares = [
      express.json(),
      express.urlencoded({ extended: true }),
      ...(middlewares ?? []),
    ];
    this.guards = guards;
    dotenv.config();
    this.app = express();
    this.container = new Container();
    this.instances = this.createInstances();
  }

  initialize() {
    this.routeRegister();
    this.applyMiddleware([
      ...(this.middlewares ?? []),
      ...(this.guards ?? []),
      ExcuteHandlerMiddleware,
      ResponseFormatterMiddleware,
      HandleErrorMiddleware,
      Handle404Middleware,
    ]);

    return this.app;
  }

  applyMiddleware(middlewares: any[] | undefined) {
    if (middlewares && middlewares.length > 0) {
      middlewares.forEach((middleware) => {
        try {
          const instance = new middleware();
          this.app.use(instance.use.bind(instance));
        } catch (error) {
          this.app.use(middleware);
        }
      });
    }
  }

  createInstances() {
    return this.controllers.map((controller) => {
      this.container.register(controller);
      return this.container.get(controller);
    });
  }

  routeRegister() {
    this.instances.map((instance) => {
      const router = registerRoutes(instance, this.prefix);
      this.app.use(router);
    });
  }
}
