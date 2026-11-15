# Turfing Knowledge Base Studio

Standalone Sanity Studio for the `i2kjqstn` project and `production` dataset.

## Development

```bash
npm install
npm run dev
```

The Studio runs at [http://localhost:3333](http://localhost:3333). Article and
category schemas live in `schemaTypes/`.

## Frontend types and schema deployment

The Next.js app is in `../web`; its query result types are currently maintained
in `web/src/sanity/queries.ts`. The Studio's automatic TypeGen configuration
and script are ready, but `sanity schemas extract` currently fails because the
resolved `framer-motion` package is missing its declared module entry file.
Schema deployment is blocked by the same issue. The Studio can still build and
run locally with the schemas in `schemaTypes/`.

Once the dependency issue is resolved, generate types after changing a schema
or GROQ query:

```bash
npm run typegen
```

Build the standalone Studio with:

```bash
npm run build
```
