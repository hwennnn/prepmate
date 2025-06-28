# Testing Guide

Unit testing setup for PrepMate using Vitest and React Testing Library.

## 📁 Structure

```
tests/
├── unit/                    # Unit tests
│   ├── components/         # React component tests
│   ├── lib/               # Utility function tests
│   └── server/            # Server-side logic tests
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

## 📝 Writing Tests

### Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import { YourComponent } from '~/path/to/YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Utility Function Template

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '~/lib/utils'

describe('yourFunction', () => {
  it('handles input correctly', () => {
    expect(yourFunction('input')).toBe('expected')
  })
})
```
