#!/bin/bash

# Test Runner Script for PrepMate
# Usage: ./test-runner.sh [option]
# Options: unit, watch, ci

set -e

echo "🧪 PrepMate Test Runner"
echo "======================="

# Default to unit tests if no argument provided
TEST_TYPE=${1:-unit}

case $TEST_TYPE in
"unit")
    echo "📝 Running unit tests..."
    pnpm test:unit
    ;;
"watch")
    echo "👁️  Running tests in watch mode..."
    pnpm test:watch
    ;;
"ci")
    echo "🤖 Running tests in CI mode..."
    pnpm test:ci
    ;;
"all")
    echo "🔄 Running all test types..."
    echo "📝 Unit tests..."
    pnpm test:unit
    echo "🤖 CI tests..."
    pnpm test:ci
    ;;
*)
    echo "❌ Unknown test type: $TEST_TYPE"
    echo "Available options: unit, watch, ci, all"
    exit 1
    ;;
esac

echo "✅ Tests completed successfully!"
