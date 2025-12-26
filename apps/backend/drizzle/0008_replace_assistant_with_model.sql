-- Migration: replace 'ASSISTANT' enum value with 'model' safely
BEGIN;

-- Add new enum value if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'message_role' AND e.enumlabel = 'model') THEN
        ALTER TYPE message_role ADD VALUE 'model';
    END IF;
END$$;

-- Update any rows using the old value
UPDATE messages SET role = 'model' WHERE role = 'ASSISTANT';

-- Create new enum type with desired values
CREATE TYPE message_role_new AS ENUM ('USER', 'model');

-- Alter the column to use the new type
ALTER TABLE messages
  ALTER COLUMN role TYPE message_role_new
  USING role::text::message_role_new;

-- Drop the old enum type and rename the new one
DROP TYPE IF EXISTS message_role;
ALTER TYPE message_role_new RENAME TO message_role;

COMMIT;
