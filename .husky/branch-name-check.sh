#!/usr/bin/env sh

branch="$(git rev-parse --abbrev-ref HEAD)"
pattern='^(master|develop)$|^(feature|fix|hotfix|release|chore)/.+$'

if ! echo "$branch" | grep -qE "$pattern"; then
  echo "Branch name '$branch' is invalid."
  echo "Branch names must match: $pattern"
  echo "Examples: feature/orders-export, fix/login-redirect, chore/update-deps"
  exit 1
fi
