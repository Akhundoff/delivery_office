# delivery_management_new

Hybrid bootstrap based on `delivery_warehouse`, scoped to session modules:

- `me`
- `settings`
- `country`

## Scripts

```bash
npm install
npm start
npm run build
```

## Git Hooks

This repo uses Husky + commitlint + lint-staged to enforce branch naming, lint/format staged files, and validate commit messages (Conventional Commits).

Requires Node >= 22 (see `.nvmrc`).

Yarn 4 does not run the `prepare` script automatically on `yarn install`, so after installing dependencies, activate the git hooks once:

```bash
yarn prepare
```

## Notes

- Router is intentionally minimal for this session.
- Auth and settings use local bootstrap/mock logic to keep coupling low.
