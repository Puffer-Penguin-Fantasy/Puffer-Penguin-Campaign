import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import os from "os";


dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5173;

  const interfaces = os.networkInterfaces();
  let networkIp = "localhost";
  for (const name of Object.keys(interfaces)) {
    for (const iface of (interfaces[name] || [])) {
      if (iface.family === "IPv4" && !iface.internal) {
        networkIp = iface.address;
        break;
      }
    }
    if (networkIp !== "localhost") break;
  }



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  \x1b[32m➜\x1b[0m  Local:   \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`  \x1b[32m➜\x1b[0m  Network: \x1b[36mhttp://${networkIp}:${PORT}\x1b[0m\n`);
  });
}

startServer();
