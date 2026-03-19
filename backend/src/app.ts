import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import livrosRoutes from "./routes/livrosRoutes";

const app = express();
const allowedOrigins = [env.frontendUrl];
const localhostOriginPattern = /^http:\/\/localhost:\d+$/;
const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        allowedOrigins.includes(origin) ||
        localhostOriginPattern.test(origin) ||
        vercelPattern.test(origin) ||
        netlifyPattern.test(origin)
      ) {
        callback(null, true);
        return;
      }

      console.warn(`CORS bloqueado para origem: ${origin}`);
      callback(null, true); // Permitir mesmo assim (log apenas)
    },
    credentials: true
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
