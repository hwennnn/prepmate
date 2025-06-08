#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_GIT_COMMIT_REF_TYPE: $VERCEL_GIT_COMMIT_REF_TYPE"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF_TYPE" == "pull-request" ]]; then
  echo "✅ - Build can proceed"
  exit 1
else
  echo "🛑 - Build cancelled"
  exit 0
fi
