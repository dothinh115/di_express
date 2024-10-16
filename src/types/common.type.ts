import { Method } from "./method.type";

export type TRouteData = {
  method: Method;
  path: string;
  handler: any;
};
