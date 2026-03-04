# LomiGlobe

Interactive globe for pinning memories and uploading memory photos to Supabase Storage.

## Local development

Requirements:

- Node.js 18+
- npm

Start the app:

```sh
npm install
npm run dev
```

Build and test:

```sh
npm run build
npm run test
```

## GitHub Pages

This repo should be deployed to GitHub Pages through a GitHub Actions build, not by serving the source branch directly.

1. In GitHub, open `Settings > Secrets and variables > Actions > Variables`.
2. Add `VITE_SUPABASE_URL`.
3. Add `VITE_SUPABASE_ANON_KEY`.
4. In `Settings > Pages`, set the source to `GitHub Actions`.

The workflow in `.github/workflows/deploy-pages.yml` will build `dist/` and publish the static site correctly for the `/LomiGlobe/` subpath.

## Supabase setup

The frontend uploads images directly from the browser using your Supabase project URL and anon key.

1. Copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` to your project URL.
3. Set `VITE_SUPABASE_ANON_KEY` to your project anon key.
4. Run the migrations in `supabase/migrations/`, or push them with the Supabase CLI.

By default the app uploads to the public `memory-images` bucket under the `memories/` folder. Override the bucket name with `VITE_SUPABASE_MEMORY_IMAGES_BUCKET` if needed.

## Notes

- Memories and uploaded image URLs are stored in Supabase, so they persist after refresh or reopening the app.
- The default image fallback is local, so the app no longer depends on a third-party placeholder service for newly created memories.
