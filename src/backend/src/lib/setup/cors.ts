import cors from "cors";
import { Express } from 'express';

const configure = (app: Express) => {
  app.use(cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://livinvicta.com"
      : "http://localhost:8080",
    credentials: true
  }))
}

export default { configure }
