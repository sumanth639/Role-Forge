import "dotenv/config";
import { createServer } from "./server.js";

const PORT = process.env.PORT || 4000;

createServer()
  .then((app) => {
    const server = app.listen(PORT, () => {
      console.log(` Roleforge backend running on http://localhost:${PORT}/graphql`);
    });

    // Handle server errors
    server.on("error", (error: Error & { code?: string }) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(() => {
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
