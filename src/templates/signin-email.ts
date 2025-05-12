interface EmailTemplateProps {
  url: string;
  host: string;
  email: string;
}

export function generateSignInEmailHTML({
  url,
  host,
  email,
}: EmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to ${host}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; max-width: 600px; width: 100%;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                🎯 PrepMate
                            </h1>
                            <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
                                Your best companion
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
                                Welcome back! 👋
                            </h2>
                            <p style="color: #4a5568; margin: 0 0 32px 0; font-size: 16px; line-height: 24px;">
                                Click the button below to securely sign in to your PrepMate account. This link will expire in 24 hours for your security.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 32px 0;">
                                        <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.3);">
                                            ✨ Sign in to PrepMate
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #4a5568; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">
                                    Or copy and paste this link:
                                </p>
                                <p style="color: #667eea; margin: 0; font-size: 14px; word-break: break-all; font-family: monospace;">
                                    ${url}
                                </p>
                            </div>
                            <p style="color: #718096; margin: 0; font-size: 14px; line-height: 20px;">
                                🔒 This is a secure sign-in link for <strong>${email}</strong>. If you didn't request this email, you can safely ignore it.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                                © 2025 PrepMate • Made with ❤️ for better studying
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export function generateSignInEmailText({
  url,
  host,
}: EmailTemplateProps): string {
  return `Welcome to PrepMate! 🎯

Sign in to ${host}

${url}

This secure link will expire in 24 hours for your security.

If you didn't request this email, you can safely ignore it.

---
PrepMate - Your best companion`;
}
