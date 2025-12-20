import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { getAuthContext } from "./auth/context.js";
import { streamRouter } from "./routes/stream.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { getGoogleUser, getGithubUser, handleOAuthLogin } from "./auth/oauth.js";

export async function createServer(): Promise<Express> {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  }));

  app.use(express.json());

  app.get("/auth/:provider", (req, res) => {
    const { provider } = req.params;
    if (provider === "google") {
      // Ensure BACKEND_URL doesn't have trailing slash and properly encode redirect_uri
      const backendUrl = process.env.BACKEND_URL
      const redirectUri = encodeURIComponent(`${backendUrl}/auth/google/callback`);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
      return res.redirect(authUrl);
    }
    if (provider === "github") {
      return res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`);
    }
    res.status(400).json({ error: "Invalid provider" });
  });

  app.get("/auth/:provider/callback", async (req, res) => {
    const { provider } = req.params;
    const { code, error } = req.query;
    
    // Handle OAuth errors from provider
    if (error) {
      console.error(`${provider} OAuth error:`, error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    if (!code) {
      console.error(`${provider} OAuth: No code provided`);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const profile = provider === "google" 
        ? await getGoogleUser(code as string) 
        : await getGithubUser(code as string);
      
      const token = await handleOAuthLogin(profile);
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (err) {
      console.error(`${provider} OAuth callback error:`, err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  });

  app.use("/stream", streamRouter);
  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => getAuthContext(req)
  }));

  return app;
}