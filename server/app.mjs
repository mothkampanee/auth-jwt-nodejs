import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { authRouter } from "./routes/auth.mjs";
import { loadSwaggerDocument } from "./utils/swagger.mjs";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const swaggerDocument = await loadSwaggerDocument();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get("/test", (req, res) => {
      return res.json({ message: "Server API is working 🚀" });
    });

    app.use("/api/v1/auth", authRouter);

    app.listen(port, async () => {
      console.log(`Server is running at ${port}`);
    });
  } catch (error) {
    console.error(
      "Failed to load Swagger document or start the server:",
      error
    );
  }
}

startServer();
