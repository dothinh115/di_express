import { Request, Response } from "express";
import { Controller } from "../decorators/controller.decorator";
import { Get } from "../decorators/method.decorator";
import { Param, Req, Res } from "../decorators/param.decorator";

@Controller("/song")
export class SongController {
  @Get("/:album/:id")
  getSong(
    @Param("album") album: string,
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return {
      album,
      id,
    };
  }
}
