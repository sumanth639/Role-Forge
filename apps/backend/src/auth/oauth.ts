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

export async function handleOAuthLogin(user: OAuthUser) {
  // 1️⃣ Find existing account
  const existingAccount = await db
    .select({
      userId: accounts.userId,
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, user.provider),
        eq(accounts.providerUserId, user.providerUserId)
      )
    )
    .limit(1);

  let userId: string;

  if (existingAccount.length) {
    const account = existingAccount[0];
    if (!account) {
      throw new Error("Failed to retrieve account");
    }
    userId = account.userId;
  } else {
    // 2️⃣ Find or create user by email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (existingUser.length) {
      const existingUserRecord = existingUser[0];
      if (!existingUserRecord) {
        throw new Error("Failed to retrieve user");
      }
      userId = existingUserRecord.id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        })
        .returning();

      if (!newUser) {
        throw new Error("Failed to create user");
      }
      userId = newUser.id;
    }

    // 3️⃣ Create account link
    await db.insert(accounts).values({
      userId,
      provider: user.provider,
      providerUserId: user.providerUserId,
    });
  }

  // 4️⃣ Issue JWT
  return signJwt({ userId });
}
