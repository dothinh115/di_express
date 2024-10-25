import express, { Application, Request, Response } from "express";
import { Container } from "../di/container.di";
import { registerRoutes } from "../routes/register.route";
import { handleErrorMiddleware } from "../middlewares/handle-error.middleware";
import { reponseFormatterMiddleware } from "../middlewares/response-formatter.middleware";
import * as dotenv from "dotenv";

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
    this.middlewares = middlewares;
    this.guards = guards;
    dotenv.config();
    this.app = express();
    this.container = new Container();
    this.instances = this.createInstances();
  }

  initialize() {
    this.middlewareRegster();
    this.guardRegister();
    this.routeRegister();
    this.interceptorRegister();
    this.app.use(reponseFormatterMiddleware);
    this.app.use(handleErrorMiddleware);
    this.route404Register();
    return this.app;
  }

  createInstances() {
    return this.controllers.map((controller) => {
      this.container.register(controller);
      return this.container.get(controller);
    });
  }

  middlewareRegster() {
    if (this.middlewares && this.middlewares.length > 0) {
      this.app.use(...this.middlewares);
    }
  }

  guardRegister() {
    if (this.guards && this.guards.length > 0) {
      this.app.use(...this.guards);
    }
  }

  routeRegister() {
    this.instances.map((instance) => {
      const router = registerRoutes(instance, this.prefix);
      this.app.use(router);
    });
  }

  interceptorRegister() {
    if (this.interceptors && this.interceptors.length > 0) {
      this.app.use(...this.interceptors);
    }
  }

  route404Register() {
    this.app.use((req: Request, res: Response) => {
      res.status(404).send({
        statusCode: 404,
        message: "Not Found",
      });
    });
  }
}
