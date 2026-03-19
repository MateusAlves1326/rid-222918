import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import livrosRoutes from "./routes/livrosRoutes";

const app = express();
const allowedOrigins = [env.frontendUrl];
const localhostOriginPattern = /^http:\/\/localhost:\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin) || localhostOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem nao permitida pelo CORS."));
    }
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/livros", livrosRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
