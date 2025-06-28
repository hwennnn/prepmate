# Testing Guide

Focused unit testing setup for PrepMate using Vitest and React Testing Library.

## 📁 Structure

```
tests/
├── unit/                    # Unit tests
│   ├── components/         # Critical component tests
│   │   └── onboarding/    # Form component tests
│   └── lib/               # Utility function tests (critical business logic only)
├── setup/                 # Test configuration
├── utils/                 # Test utilities and helpers
└── README.md
```

## 🚀 Commands

```bash
# Run all tests
pnpm test

# Watch mode (development)
pnpm test:watch

# CI mode (verbose output)
pnpm test:ci

# Using test runner script
./test-runner.sh unit    # Run unit tests
./test-runner.sh watch   # Watch mode
./test-runner.sh ci      # CI mode
```

## 🎯 Testing Philosophy

This test suite focuses on **critical business logic only**:

- **Authentication error handling** - Security-critical functionality
- **Date formatting** - Essential for resume generation
- **Profile data conversion** - Core business logic for form data processing
- **Essential form components** - Critical user input handling
- **Essential utilities** - Critical helper functions (className merging, URL formatting)

### What We Test

- Core business logic that affects user data
- Security-critical authentication flows
- Data transformation functions
- Essential form functionality and validation
- Essential utility functions

## 📝 Writing Tests

### Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import { YourComponent } from '~/path/to/YourComponent'

describe('YourComponent', () => {
  it('handles critical functionality', () => {
    render(<YourComponent />)
    expect(screen.getByLabelText(/important field/i)).toBeInTheDocument()
  })
})
```

### Utility Function Template

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '~/lib/utils'

describe('yourFunction', () => {
  it('handles critical business case', () => {
    expect(yourFunction('input')).toBe('expected')
  })
})
```
