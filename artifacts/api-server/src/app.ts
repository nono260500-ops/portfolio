import express, { type Express } from "express";
import cors from "cors";
import pinoHttp, { type HttpLogger } from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

app.use(
  (pinoHttp as unknown as (opts: object) => HttpLogger)({
    logger,
    serializers: {
      req(req: { id: string; method: string; url?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: { statusCode: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// En production : même serveur = pas besoin de CORS
// En développement : Vite tourne sur un port différent
if (!isProduction) {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API (priorité absolue)
app.use("/api", router);

// En production : sert les pages HTML/CSS/JS compilées
if (isProduction) {
  const publicDir = path.join(currentDir, "public");

  // Fichiers statiques : index.html de chaque dossier (MPA)
  app.use(
    express.static(publicDir, {
      index: ["index.html"],
      redirect: true,
    }),
  );

  // Fallback : si aucune page trouvée, renvoie l'accueil
  app.use((_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
