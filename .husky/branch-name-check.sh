#!/usr/bin/env sh

branch="$(git rev-parse --abbrev-ref HEAD)"
pattern='^(master|develop)$|^(feat|fix|bugfix|hotfix|chore|arch|release)/.+$'

if ! echo "$branch" | grep -qE "$pattern"; then
  echo "Branch name '$branch' is invalid."
  echo "Branch names must match: $pattern"
  exit 1
fi
