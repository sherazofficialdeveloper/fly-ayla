export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static isConfigured(): boolean {
    return !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    );
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    const from = process.env.EMAIL_FROM || 'Fly Ayla Flight Operations <ops@flyayla.com>';

    if (!this.isConfigured()) {
      console.log(`\n📧 [Email Service] Simulated Dispatch`);
      console.log(`To: ${options.to}`);
      console.log(`From: ${from}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Preview: ${options.text || 'HTML Content'}\n`);
      return true;
    }

    try {
      // Production SMTP integration placeholder
      console.log(`📧 [Email Service] Dispatching to ${options.to}: "${options.subject}"`);
      return true;
    } catch (err: any) {
      console.error(`❌ [Email Service] Failed to send email to ${options.to}:`, err.message);
      return false;
    }
  }

  static async sendPasswordResetEmail(email: string, resetToken: string, appUrl: string): Promise<boolean> {
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
    return this.sendEmail({
      to: email,
      subject: 'Fly Ayla — Security Clearance: Password Reset Instructions',
      text: `A password reset was requested for your Fly Ayla executive account. Reset your password here: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0b0e; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ef4444; margin-top: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 16px;">Fly Ayla Private Aviation</h2>
          <h1 style="font-size: 24px; font-weight: bold; margin: 16px 0;">Reset Your Account Password</h1>
          <p style="color: #a1a1aa; line-height: 1.6; font-size: 14px;">We received a request to reset your credentials for the Fly Ayla VIP Flight Portal. Click the button below to establish a new secure password.</p>
          <div style="margin: 32px 0;">
            <a href="${resetUrl}" style="background: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; font-size: 13px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #71717a; font-size: 12px; line-height: 1.5;">This link will expire in 60 minutes. If you did not request this change, please disregard this transmission or notify Flight Operations immediately.</p>
        </div>
      `,
    });
  }

  static async sendVerificationEmail(email: string, verificationToken: string, appUrl: string): Promise<boolean> {
    const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`;
    return this.sendEmail({
      to: email,
      subject: 'Fly Ayla — Verify Your Executive Flight Account',
      text: `Welcome to Fly Ayla. Please verify your email here: ${verifyUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0b0e; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ef4444; margin-top: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 16px;">Fly Ayla Private Aviation</h2>
          <h1 style="font-size: 24px; font-weight: bold; margin: 16px 0;">Verify Your Executive Account</h1>
          <p style="color: #a1a1aa; line-height: 1.6; font-size: 14px;">Welcome to Fly Ayla. Please verify your email address to enable priority quotation generation and direct flight booking.</p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="background: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; font-size: 13px; display: inline-block;">Verify Email</a>
          </div>
        </div>
      `,
    });
  }
}
