# Husky + Commitlint + Lint/Format Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Husky git hooks that enforce branch naming, run ESLint+Prettier on staged files, and lint commit messages with Conventional Commits via commitlint.

**Architecture:** Husky v9 manages `.husky/pre-commit` (branch-name check + `lint-staged`) and `.husky/commit-msg` (`commitlint`). `lint-staged` runs `eslint --fix` + `prettier --write` on staged files using the existing CRA `eslintConfig` and a new `.prettierrc`.

**Tech Stack:** husky v9, lint-staged, @commitlint/cli, @commitlint/config-conventional, prettier (existing), eslint (existing, via react-scripts)

**Branch:** `chore/setup-husky-commitlint` (already created, design doc already committed)

**Spec:** `docs/superpowers/specs/2026-06-10-husky-commitlint-setup-design.md`

---

### Task 1: Install dependencies and initialize Husky

**Files:**
- Modify: `package.json`
- Modify: `yarn.lock`
- Create: `.husky/pre-commit` (default content from `husky init`, overwritten in Task 5)

- [ ] **Step 1: Install dependencies**

```bash
yarn add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

- [ ] **Step 2: Initialize Husky**

```bash
npx husky init
```

Expected: creates `.husky/pre-commit` (containing `npm test` by default), adds `"prepare": "husky"` to `package.json` scripts, and sets `core.hooksPath=.husky` in git config.

- [ ] **Step 3: Replace the default `pre-commit` placeholder**

The default `.husky/pre-commit` runs `npm test`, which would invoke `react-app-rewired test` (Jest) and hang the commit in Step 5 below. Overwrite it with a harmless placeholder (Task 5 replaces this with the real content):

```sh
echo "husky pre-commit placeholder (configured in Task 5)"
```

- [ ] **Step 4: Verify**

```bash
git config core.hooksPath
cat package.json | grep -A2 '"prepare"'
ls .husky
```

Expected: `core.hooksPath` prints `.husky`; `prepare` script is `"husky"`; `.husky/pre-commit` exists.

- [ ] **Step 5: Commit**

```bash
git add package.json yarn.lock .husky
git commit -m "chore: install husky, lint-staged, commitlint"
```

---

### Task 2: Add Prettier config and format scripts

**Files:**
- Create: `.prettierrc`
- Modify: `package.json` (add `format` and `format:check` scripts)

- [ ] **Step 1: Create `.prettierrc`**

```json
{
  "printWidth": 200,
  "singleQuote": true,
  "trailingComma": "all"
}
```

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block, add:

```json
"format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,scss,md}\"",
"format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,css,scss,md}\""
```

- [ ] **Step 3: Verify on a single file**

```bash
npx prettier --check src/App.tsx
```

Expected: prints either `Checking formatting...` with no file listed (already formatted) or lists `src/App.tsx` as needing formatting — either output is fine, this just confirms `.prettierrc` is picked up and the command runs without error.

- [ ] **Step 4: Commit**

```bash
git add .prettierrc package.json
git commit -m "chore: add prettier config and format scripts"
```

---

### Task 3: Add commitlint config and commit-msg hook

**Files:**
- Create: `commitlint.config.js`
- Create: `.husky/commit-msg`

- [ ] **Step 1: Create `commitlint.config.js`**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

- [ ] **Step 2: Verify config against a good and bad message**

```bash
echo "this is not a valid message" | npx commitlint
echo "chore: verify commitlint config" | npx commitlint
```

Expected: first command exits non-zero and reports `subject may not be empty` / `type may not be empty` style errors; second command exits 0 with no output.

- [ ] **Step 3: Create `.husky/commit-msg`**

```sh
npx --no -- commitlint --edit "$1"
```

- [ ] **Step 4: Make the hook executable**

```bash
chmod +x .husky/commit-msg
```

- [ ] **Step 5: Commit**

```bash
git add commitlint.config.js .husky/commit-msg
git commit -m "chore: add commitlint config and commit-msg hook"
```

---

### Task 4: Add branch name validation script

**Files:**
- Create: `.husky/branch-name-check.sh`

- [ ] **Step 1: Create `.husky/branch-name-check.sh`**

```sh
#!/usr/bin/env sh

branch="$(git rev-parse --abbrev-ref HEAD)"
pattern='^(master|develop)$|^(feature|fix|hotfix|release|chore)/.+$'

if ! echo "$branch" | grep -qE "$pattern"; then
  echo "Branch name '$branch' is invalid."
  echo "Branch names must match: $pattern"
  echo "Examples: feature/orders-export, fix/login-redirect, chore/update-deps"
  exit 1
fi
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x .husky/branch-name-check.sh
```

- [ ] **Step 3: Verify against the current branch (should pass)**

```bash
sh .husky/branch-name-check.sh; echo "exit code: $?"
```

Expected: `exit code: 0` (current branch `chore/setup-husky-commitlint` matches the pattern).

- [ ] **Step 4: Verify against an invalid branch name (should fail)**

```bash
git checkout -b temp-bad-branch-name
sh .husky/branch-name-check.sh; echo "exit code: $?"
git checkout chore/setup-husky-commitlint
git branch -D temp-bad-branch-name
```

Expected: prints the "Branch name ... is invalid" message and `exit code: 1`.

- [ ] **Step 5: Commit**

```bash
git add .husky/branch-name-check.sh
git commit -m "chore: add branch name validation script"
```

---

### Task 5: Wire up pre-commit hook (branch check + lint-staged) and lint scripts

**Files:**
- Modify: `.husky/pre-commit`
- Modify: `package.json` (add `lint`, `lint:fix` scripts and `lint-staged` config)

- [ ] **Step 1: Overwrite `.husky/pre-commit`**

`set -e` ensures the hook stops (and blocks the commit) if the branch-name check fails, instead of falling through to `lint-staged`:

```sh
set -e

sh "$(dirname -- "$0")/branch-name-check.sh"
npx lint-staged
```

- [ ] **Step 2: Add lint scripts to `package.json`**

In `"scripts"`, add:

```json
"lint": "eslint src --ext .ts,.tsx",
"lint:fix": "eslint src --ext .ts,.tsx --fix"
```

- [ ] **Step 3: Add `lint-staged` config to `package.json`**

Add a top-level key (sibling of `"scripts"`, `"dependencies"`, etc.):

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,scss,md,json}": [
    "prettier --write"
  ]
}
```

- [ ] **Step 4: Verify lint-staged runs on a staged file**

```bash
git add package.json
npx lint-staged
```

Expected: runs `eslint --fix` and `prettier --write` against `package.json` (matches the `*.{css,scss,md,json}` glob via `package.json`'s `.json` extension... note: lint-staged matches `package.json` against `*.{css,scss,md,json}`, running only `prettier --write`). Command exits 0.

- [ ] **Step 5: Commit**

```bash
git add .husky/pre-commit package.json
git commit -m "chore: wire up pre-commit hook with branch check and lint-staged"
```

---

### Task 6: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Verify commit-msg hook blocks a bad message**

```bash
echo "test content" >> docs/superpowers/specs/2026-06-10-husky-commitlint-setup-design.md
git add docs/superpowers/specs/2026-06-10-husky-commitlint-setup-design.md
git commit -m "not a valid message"; echo "exit code: $?"
```

Expected: commit fails (`exit code` non-zero) with commitlint errors. The bad commit must NOT be created.

- [ ] **Step 2: Revert the test edit**

```bash
git checkout docs/superpowers/specs/2026-06-10-husky-commitlint-setup-design.md
```

- [ ] **Step 3: Verify branch-name check blocks a commit on an invalid branch**

```bash
git checkout -b temp-invalid-branch
echo "test" >> .gitignore
git add .gitignore
git commit -m "chore: should be blocked"; echo "exit code: $?"
```

Expected: pre-commit hook fails with the "Branch name ... is invalid" message before lint-staged runs; `exit code` non-zero; no commit created.

- [ ] **Step 4: Clean up the test branch**

```bash
git checkout .gitignore
git checkout chore/setup-husky-commitlint
git branch -D temp-invalid-branch
```

- [ ] **Step 5: Verify a valid commit on the correct branch succeeds**

```bash
git status
```

Expected: working tree clean (all prior task commits already made; this confirms no leftover test artifacts before finishing).

---

## Summary of new/changed files

- `package.json` — new devDependencies, `prepare`/`lint`/`lint:fix`/`format`/`format:check` scripts, `lint-staged` config
- `yarn.lock` — updated
- `.prettierrc` — new
- `commitlint.config.js` — new
- `.husky/pre-commit` — branch check + lint-staged
- `.husky/commit-msg` — commitlint
- `.husky/branch-name-check.sh` — branch name validation
