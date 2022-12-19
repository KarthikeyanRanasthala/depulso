import { createClient } from "@supabase/supabase-js";

import { getRemoteConfig } from "./service";

let cachedClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const config = await getRemoteConfig();

  cachedClient = createClient(config.supabaseURL, config.supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  return cachedClient;
};
