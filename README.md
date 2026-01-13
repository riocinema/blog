# Rio Forever Blog

This repository contains the source code and content for the Rio Cinema blog
(`blog.riocinema.org.uk`).

## Stack
- Eleventy (static site generator)
- Decap CMS (content management)
- Cloudflare Pages (hosting + SSL)

## Structure
- `src/` — site source files
- `src/posts/` — blog posts (Markdown)
- `src/images/` — uploaded images
- `admin/` — CMS configuration

## Editing content
Blog posts are written in Markdown and can be created/edited via the CMS
at `/admin`.

## Deployment
The site is automatically built and deployed via Cloudflare Pages whenever
changes are pushed to the `main` branch.
