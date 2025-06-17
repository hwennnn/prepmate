#!/bin/bash

# 1. Extract files that failed Prettier formatting
echo "Running Prettier check..."
pnpm prettier --list-different "**/*.{ts,tsx,js,jsx,mdx}" > failed.txt

# 2. If no files failed, exit early
if [ ! -s failed.txt ]; then
  echo "✅ No Prettier issues found. All files are correctly formatted."
  rm failed.txt
  exit 0
fi

# 3. Output what was run and what failed
echo "Command ran: pnpm prettier --list-different \"**/*.{ts,tsx,js,jsx,mdx}\""
echo "Files with Prettier issues:"
echo "---------------------------"
cat failed.txt | sed 's/^/[Warn] /'
echo "---------------------------"

# 4. Prompt user for confirmation
read -p "Auto fix these files with pnpm prettier --write? (y/n): " answer

if [[ "$answer" == [Yy] ]]; then
  echo "🔧 Auto-fixing files..."
  while IFS= read -r filepath; do
    if [[ -f "$filepath" ]]; then
      echo "Formatting $filepath"
      pnpm prettier --write "$filepath"
    else
      echo "❌ Skipping missing file: $filepath"
    fi
  done < failed.txt
  rm failed.txt
  echo "✅ Done formatting."
else
  echo "❌ Skipping auto-fix. List of unformatted files kept in failed.txt"
  exit 1
fi
