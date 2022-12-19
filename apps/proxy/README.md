# Depulso Proxy

- HTTP Proxy to facilitate,
    - Static file serving from Supabase storage
    - Custom domain routing for "https://depulso.co" and "https://auth.depulso.co"

- Deployed on Fly.io and exposed at "*.depulso.site"

## Uses

- `@supabase/supabase-js` for admin access to storage buckets for static file serving
- `http-proxy-middleware` to proxy incoming requests, from "*.depulso.site" or custom domains to supabase storage
- `dotenv`, `express`, `zod` and `morgan`

## Local Development

- Environment variables,
    - PORT
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE
    - SUPABASE_BUCKET_ID
    - DEPULSO_URL_SUFFIX (URL suffix of the wildcard domain - `.depulso.site`)

- `node index.js`