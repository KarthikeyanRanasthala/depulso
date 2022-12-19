# Depulso Web

- Web app to facilitate,
    - SEO
    - Dashboard to create/read/delete Projects

- Deployed on Depulso and exposed at https://depulso.co


## Uses

- `@supabase/supabase-js` and `@supabase/auth-helpers-react` for Auth and Storage read
- `@nextui-org/react` and `next-themes` for UI components and themeing.
- `Next.js` with static export.

## Local Development

- Environment variables,
    - NEXT_PUBLIC_API_ORIGIN (Depulso API URL)
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY

- `npm run dev`