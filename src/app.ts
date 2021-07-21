import dotenv from "dotenv";
import { Server } from "./server";

dotenv.config();

(new Server()).listen((port) => {
  console.log(`Server started at port ${port}`);
});
