import { describe, expect, it } from 'vitest';
import {
    getAuthErrorMessage,
    handleSignInResult,
    useAuthError
} from '../../../src/lib/auth-errors';

describe('getAuthErrorMessage', () => {
  it('returns specific message for OAuthAccountNotLinked', () => {
    expect(getAuthErrorMessage('OAuthAccountNotLinked')).toBe(
      'This email is already registered with a different sign-in method. Please use the same method you used before.'
    );
  });

  it('returns specific message for CredentialsSignin', () => {
    expect(getAuthErrorMessage('CredentialsSignin')).toBe(
      'Invalid credentials provided.'
    );
  });

  it('returns specific message for SessionRequired', () => {
    expect(getAuthErrorMessage('SessionRequired')).toBe(
      'Please sign in to access this page.'
    );
  });

  it('returns default message for unknown error codes', () => {
    expect(getAuthErrorMessage('UnknownError')).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });
});

describe('handleSignInResult', () => {
  it('returns null when result has no error', () => {
    expect(handleSignInResult({})).toBeNull();
    expect(handleSignInResult({ error: undefined })).toBeNull();
  });

  it('returns provider-specific message when provider is provided', () => {
    const result = { error: 'SomeError' };
    expect(handleSignInResult(result, 'Google')).toBe(
      'Failed to sign in with Google. Please try again.'
    );
  });

  it('returns generic message when no provider is specified', () => {
    const result = { error: 'SomeError' };
    expect(handleSignInResult(result)).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });
});

describe('useAuthError', () => {
  it('returns null when no error parameter exists', () => {
    const searchParams = new URLSearchParams();
    expect(useAuthError(searchParams)).toBeNull();
  });

  it('returns formatted error message when error parameter exists', () => {
    const searchParams = new URLSearchParams('error=OAuthAccountNotLinked');
    expect(useAuthError(searchParams)).toBe(
      'This email is already registered with a different sign-in method. Please use the same method you used before.'
    );
  });

  it('returns default message for unknown error codes from URL', () => {
    const searchParams = new URLSearchParams('error=UnknownErrorCode');
    expect(useAuthError(searchParams)).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });
});