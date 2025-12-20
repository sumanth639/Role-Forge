import { db } from "../db/client.js";
import { users, accounts } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { signJwt } from "./jwt.js";

type OAuthUser = {
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: "google" | "github";
  providerUserId: string;
};

export async function getGoogleUser(code: string) {
  // Validate required environment variables
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is not set");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET environment variable is not set");
  }

  // Ensure BACKEND_URL doesn't have trailing slash to match the redirect URI used in initial request
  const backendUrl = process.env.BACKEND_URL
  const redirectUri = `${backendUrl}/auth/google/callback`;
  
  // Log for debugging (without exposing secret)
  console.log("Google OAuth: Using Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...");
  console.log("Google OAuth: Redirect URI:", redirectUri);
  
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  
  if (!tokenRes.ok || !tokenData.access_token) {
    console.error("Google OAuth token error:", tokenData);
    throw new Error(`Google OAuth token error: ${tokenData.error || 'Unknown error'}`);
  }

  const { access_token } = tokenData;
  
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    const errorData = await userRes.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error("Google user info error:", errorData);
    throw new Error(`Google user info error: ${errorData.error || 'Unknown error'}`);
  }

  const profile = await userRes.json();
  
  if (!profile.email || !profile.id) {
    console.error("Google profile missing required fields:", profile);
    throw new Error("Google profile missing email or id");
  }

  return {
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.picture,
    provider: "google" as const,
    providerUserId: profile.id,
  };
}

export async function getGithubUser(code: string) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  
  if (!tokenData.access_token) {
    console.error("GitHub OAuth token error:", tokenData);
    throw new Error(`GitHub OAuth token error: ${tokenData.error || 'Unknown error'}`);
  }

  const { access_token } = tokenData;
  
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    const errorData = await userRes.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error("GitHub user info error:", errorData);
    throw new Error(`GitHub user info error: ${errorData.error || 'Unknown error'}`);
  }

  const profile = await userRes.json();
  
  return {
    email: profile.email || `${profile.login}@github.com`,
    name: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
    provider: "github" as const,
    providerUserId: profile.id.toString(),
  };
}

export async function handleOAuthLogin(user: OAuthUser) {
  const [existingAccount] = await db
    .select({ userId: accounts.userId })
    .from(accounts)
    .where(and(eq(accounts.provider, user.provider), eq(accounts.providerUserId, user.providerUserId)))
    .limit(1);

  let userId: string;

  if (existingAccount) {
    userId = existingAccount.userId;
  } else {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({ email: user.email, name: user.name, avatarUrl: user.avatarUrl })
        .returning();
      if (!newUser) throw new Error("Failed to create user");
      userId = newUser.id;
    }

    await db.insert(accounts).values({
      userId,
      provider: user.provider,
      providerUserId: user.providerUserId,
    });
  }

  return signJwt({ userId });
}