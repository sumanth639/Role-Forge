import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";


import { getAuthContext } from "./auth/context.js";
import { streamRouter } from "./routes/stream.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

export async function createServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      // Don't expose internal errors in production
      if (process.env.NODE_ENV === "production") {
        return {
          message: error.message,
          extensions: {
            code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
          },
        };
      }
      return error;
    },
  });

  await server.start();

  app.use("/stream", streamRouter);

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => getAuthContext(req),
    })
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Global error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    
    // Don't send error details in production
    const message = process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message;

    res.status(500).json({ error: message });
  });

  return app;
}
