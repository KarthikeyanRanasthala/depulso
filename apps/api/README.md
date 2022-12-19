# Depulso API

- API to facilitate,
    - Getting a Project Name suggestion
    - Checking availability of a Project Name
    - Creating a Project
    - Deleting a Project
    - Serving a common config for CLI and web app.

- Deployed on Fly.io and exposed at https://api.depulso.co


## Uses

- `@supabase/supabase-js` for admin access to Project CRUD operations and auth middleware
- `unique-names-generator` to generate unique names for Projects
- `compression`, `cors`, `dotenv`, `express`, `zod` and `morgan`

## Local Development

- Environment variables,
    - PORT
    - SUPABASE_ANON_KEY
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE
    - SUPABASE_BUCKET_ID
    - WEB_ORIGIN (Web app's origin for CORS)
    - MAX_DEPLOYMENT_SIZE (Maximum size in MB for each deployment)
    - MAX_PROJECTS_LIMIT (Maximum projects per user)

- `npm run dev`