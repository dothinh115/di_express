import "reflect-metadata";
import { UserController } from "./controllers/user.controller";
import { PostController } from "./controllers/post.controller";
import { SongController } from "./controllers/song.controller";
import { createApp } from "./init/app.init";
import mongoose from "mongoose";

const app = createApp({
  controllers: [UserController, PostController, SongController],
});

const uri = "mongodb://root:1234@localhost:27017"; // Thay 'mydatabase' bằng tên cơ sở dữ liệu của bạn

mongoose
  .connect(uri, { dbName: "node" })
  .then(() => {
    console.log("Kết nối đến MongoDB thành công!");
  })
  .catch((err) => {
    console.error("Lỗi kết nối đến MongoDB:", err);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// middleware -> guard -> handler -> interceptor -> error handler
