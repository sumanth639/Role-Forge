import { readFile } from 'fs/promises';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set in the environment.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  try {
    console.log('Applying SQL migration (split statements)...');

    // 1) Ensure 'model' enum value exists
    const check = await sql.query("SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'message_role' AND e.enumlabel = 'model'");
    if (!check || check.rowCount === 0) {
      console.log("Adding 'model' to message_role enum...");
      await sql.query("ALTER TYPE message_role ADD VALUE 'model'");
    } else {
      console.log("'model' already exists in message_role");
    }

    // 2) Update rows
    console.log('Updating existing message rows from ASSISTANT to model...');
    await sql.query("UPDATE messages SET role = 'model' WHERE role = 'ASSISTANT'");

    // 3) Create new enum type and swap
    console.log('Creating new enum type and swapping column...');
    await sql.query("CREATE TYPE message_role_new AS ENUM ('USER', 'model')");
    await sql.query("ALTER TABLE messages ALTER COLUMN role TYPE message_role_new USING role::text::message_role_new");
    await sql.query("DROP TYPE IF EXISTS message_role");
    await sql.query("ALTER TYPE message_role_new RENAME TO message_role");

    console.log('Migration applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();
