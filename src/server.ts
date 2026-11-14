import connectDatabase from "./config/database.js";
import app from "./main.js";
import { PORT } from "./shared/constants/index.js";

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`JobFusion API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start JobFusion API:", error);
    process.exit(1);
  }
}

startServer();
