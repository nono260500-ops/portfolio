import "dotenv/config";
import app from "./app";

// Point d'entrée pour Vercel (serverless)
// Exporte l'app Express sans appeler app.listen()
// Vercel gère le cycle de vie du serveur
export default app;
