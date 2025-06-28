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

  it('returns specific message for OAuthSignin', () => {
    expect(getAuthErrorMessage('OAuthSignin')).toBe(
      'There was an error signing in with the OAuth provider.'
    );
  });

  it('returns specific message for OAuthCallback', () => {
    expect(getAuthErrorMessage('OAuthCallback')).toBe(
      'There was an error in the OAuth callback.'
    );
  });

  it('returns specific message for OAuthCreateAccount', () => {
    expect(getAuthErrorMessage('OAuthCreateAccount')).toBe(
      'Could not create OAuth account.'
    );
  });

  it('returns specific message for EmailCreateAccount', () => {
    expect(getAuthErrorMessage('EmailCreateAccount')).toBe(
      'Could not create account with email.'
    );
  });

  it('returns specific message for Callback', () => {
    expect(getAuthErrorMessage('Callback')).toBe(
      'There was an error in the callback URL.'
    );
  });

  it('returns specific message for OAuthCallbackError', () => {
    expect(getAuthErrorMessage('OAuthCallbackError')).toBe(
      'OAuth callback error occurred.'
    );
  });

  it('returns specific message for EmailSignin', () => {
    expect(getAuthErrorMessage('EmailSignin')).toBe(
      'Could not send email. Please try again.'
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

  it('returns default message for empty string', () => {
    expect(getAuthErrorMessage('')).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });

  it('returns default message for random string', () => {
    expect(getAuthErrorMessage('RandomErrorCode123')).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });

  it('handles case sensitivity - unknown if not exact match', () => {
    expect(getAuthErrorMessage('oauthaccountnotlinked')).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });
});

describe('handleSignInResult', () => {
  it('returns null when result is undefined', () => {
    expect(handleSignInResult(undefined)).toBeNull();
  });

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

  it('returns provider-specific message for different providers', () => {
    const result = { error: 'OAuthSignin' };
    expect(handleSignInResult(result, 'GitHub')).toBe(
      'Failed to sign in with GitHub. Please try again.'
    );
    expect(handleSignInResult(result, 'Discord')).toBe(
      'Failed to sign in with Discord. Please try again.'
    );
  });

  it('returns generic message when no provider is specified', () => {
    const result = { error: 'SomeError' };
    expect(handleSignInResult(result)).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });

  it('handles empty string provider', () => {
    const result = { error: 'SomeError' };
    expect(handleSignInResult(result, '')).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });

  it('ignores error type and focuses on provider when provider is given', () => {
    const result = { error: 'OAuthAccountNotLinked' };
    expect(handleSignInResult(result, 'Google')).toBe(
      'Failed to sign in with Google. Please try again.'
    );
  });

  it('handles result with empty error string', () => {
    const result = { error: '' };
    expect(handleSignInResult(result, 'Google')).toBeNull();
  });

  it('handles complex result objects', () => {
    const result = { 
      error: 'OAuthSignin', 
      status: 'error',
      details: 'Additional info'
    };
    expect(handleSignInResult(result, 'GitHub')).toBe(
      'Failed to sign in with GitHub. Please try again.'
    );
  });
});

describe('useAuthError', () => {
  it('returns null when no error parameter exists', () => {
    const searchParams = new URLSearchParams();
    expect(useAuthError(searchParams)).toBeNull();
  });

  it('returns null when error parameter is empty', () => {
    const searchParams = new URLSearchParams('error=');
    expect(useAuthError(searchParams)).toBeNull();
  });

  it('returns formatted error message when error parameter exists', () => {
    const searchParams = new URLSearchParams('error=OAuthAccountNotLinked');
    expect(useAuthError(searchParams)).toBe(
      'This email is already registered with a different sign-in method. Please use the same method you used before.'
    );
  });

  it('handles multiple parameters correctly', () => {
    const searchParams = new URLSearchParams('error=EmailSignin&redirect=/dashboard');
    expect(useAuthError(searchParams)).toBe(
      'Could not send email. Please try again.'
    );
  });

  it('returns default message for unknown error codes from URL', () => {
    const searchParams = new URLSearchParams('error=UnknownErrorCode');
    expect(useAuthError(searchParams)).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });

  it('handles URL encoded error parameters', () => {
    const searchParams = new URLSearchParams('error=OAuth%20Error');
    expect(useAuthError(searchParams)).toBe(
      'An error occurred during sign in. Please try again.'
    );
  });

  it('handles common NextAuth error codes from URL', () => {
    const credentialsError = new URLSearchParams('error=CredentialsSignin');
    expect(useAuthError(credentialsError)).toBe('Invalid credentials provided.');

    const sessionError = new URLSearchParams('error=SessionRequired');
    expect(useAuthError(sessionError)).toBe('Please sign in to access this page.');
  });

  it('gets first error parameter if multiple exist', () => {
    // URLSearchParams.get() returns the first value for a parameter
    const searchParams = new URLSearchParams('error=OAuthSignin&error=EmailSignin');
    expect(useAuthError(searchParams)).toBe(
      'There was an error signing in with the OAuth provider.'
    );
  });
}); 