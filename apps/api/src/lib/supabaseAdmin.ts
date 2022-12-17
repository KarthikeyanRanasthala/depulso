import { createClient } from "@supabase/supabase-js";
import { env } from "..";

export const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const storageAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: "storage",
    },
  }
);
