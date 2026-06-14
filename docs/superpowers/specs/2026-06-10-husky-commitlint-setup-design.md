# Husky + Commitlint + Lint/Format Hooks Setup

## Goal

Add git hook tooling to enforce code quality and commit/branch conventions before code is committed:

- ESLint check (auto-fix) on staged files
- Prettier formatting on staged files
- Commit message linting (Conventional Commits)
- Branch name validation

## Branch

`chore/setup-husky-commitlint`

## Dependencies (devDependencies)

- `husky` (v9 — modern hook format, no `_/husky.sh` shim)
- `lint-staged`
- `@commitlint/cli`
- `@commitlint/config-conventional`
- `prettier` — already present (`^3.3.3`), no change

## New Config Files

### `.prettierrc`

```json
{
  "printWidth": 200,
  "singleQuote": true,
  "trailingComma": "all"
}
```

Per CLAUDE.md's documented warehouse style. No prettier config currently exists in this repo.

### `commitlint.config.js`

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

### `.husky/pre-commit`

1. Validate current branch name against allowed pattern.
2. Run `npx lint-staged`.

### `.husky/branch-name-check.sh`

Validates branch name matches:

```
^(master|develop)$|^(feature|fix|hotfix|release|chore)\/.+$
```

Exits non-zero with a helpful message if it doesn't match.

### `.husky/commit-msg`

Runs `npx --no -- commitlint --edit "$1"`.

## package.json Changes

### Scripts

```json
{
  "prepare": "husky",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,scss,md}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,css,scss,md}\""
}
```

### lint-staged config

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,md,json}": ["prettier --write"]
  }
}
```

## Hook Flow

- **pre-commit**: branch name check → lint-staged (ESLint --fix + Prettier --write on staged files). Commit blocked if ESLint reports unfixable errors.
- **commit-msg**: commitlint validates the message against Conventional Commits (matches existing `feat:`, `fix:`, `feat(scope):` style already used in this repo's history).

Branch validation is **pre-commit only** (not pre-push), per user decision.

## Out of Scope

- CI-level lint/format enforcement (not requested)
- Changing existing ESLint config (`eslintConfig: { extends: "react-app" }` in package.json is reused as-is)
