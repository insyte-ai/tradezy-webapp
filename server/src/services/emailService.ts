import * as brevo from '@getbrevo/brevo';
import logger from '../utils/logger';

class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;
  private sender = {
    name: 'TradeZy',
    email: process.env.SENDER_EMAIL || 'noreply@tradezy.com'
  };

  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    
    const apiKey = process.env.BREVO_API_KEY || '';
    if (apiKey) {
      this.apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        apiKey
      );
      logger.info('Brevo email service initialized');
    } else {
      logger.warn('BREVO_API_KEY not found in environment variables');
    }
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Verify Your TradeZy Account';
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ 
        email: to,
        name: to.split('@')[0]
      }];
      
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TradeZy</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for signing up with TradeZy! Please click the button below to verify your email address and complete your registration.</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with TradeZy, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 TradeZy. All rights reserved.</p>
              <p>Questions? Contact us at support@tradezy.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      sendSmtpEmail.textContent = `
        Welcome to TradeZy!
        
        Please verify your email address by clicking the link below:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with TradeZy, please ignore this email.
        
        © 2024 TradeZy. All rights reserved.
      `;

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Email verification sent', { to, messageId: (result.body as any).messageId });
    } catch (error: any) {
      logger.error('Failed to send email verification', { 
        to, 
        error: error.message,
        stack: error.stack,
        response: error.response?.body 
      });
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(to: string, name: string, role: 'buyer' | 'seller'): Promise<void> {
    try {
      const dashboardUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/${role}/dashboard`;
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Welcome to TradeZy - Account Approved!';
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ email: to, name }];
      
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-left: 3px solid #000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TradeZy!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Great news! Your TradeZy ${role} account has been approved and is now active.</p>
              
              ${role === 'seller' ? `
                <div class="feature-box">
                  <h3>What you can do now:</h3>
                  <ul>
                    <li>List your products</li>
                    <li>Manage your inventory</li>
                    <li>Process orders</li>
                    <li>Connect with retailers</li>
                    <li>Track your sales analytics</li>
                  </ul>
                </div>
              ` : `
                <div class="feature-box">
                  <h3>What you can do now:</h3>
                  <ul>
                    <li>Browse thousands of products</li>
                    <li>Connect with verified suppliers</li>
                    <li>Place wholesale orders</li>
                    <li>Manage your purchases</li>
                    <li>Access exclusive deals</li>
                  </ul>
                </div>
              `}
              
              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              </div>
              
              <p>Need help getting started? Check out our <a href="${process.env.CLIENT_URL}/help">help center</a> or contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 TradeZy. All rights reserved.</p>
              <p>Questions? Contact us at support@tradezy.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Welcome email sent', { to, messageId: (result.body as any).messageId });
    } catch (error: any) {
      logger.error('Failed to send welcome email', { 
        to, 
        error: error.message,
        response: error.response?.body 
      });
      // Don't throw here as welcome email is not critical
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Reset Your TradeZy Password';
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ 
        email: to,
        name: to.split('@')[0]
      }];
      
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your TradeZy account password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
              
              <div class="warning">
                <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
            </div>
            <div class="footer">
              <p>© 2024 TradeZy. All rights reserved.</p>
              <p>Questions? Contact us at support@tradezy.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Password reset email sent', { to, messageId: (result.body as any).messageId });
    } catch (error: any) {
      logger.error('Failed to send password reset email', { 
        to, 
        error: error.message,
        response: error.response?.body 
      });
      throw new Error('Failed to send password reset email');
    }
  }

  async sendAccountStatusEmail(to: string, name: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = `TradeZy Account ${status === 'approved' ? 'Approved' : 'Update'}`;
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ email: to, name }];
      
      if (status === 'approved') {
        sendSmtpEmail.htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background-color: #f9f9f9; }
              .button { display: inline-block; padding: 12px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Account Approved!</h1>
              </div>
              <div class="content">
                <h2>Congratulations ${name}!</h2>
                <p>Your TradeZy account has been approved. You now have full access to all platform features.</p>
                <div style="text-align: center;">
                  <a href="${process.env.CLIENT_URL}/login" class="button">Login to Your Account</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
      } else {
        sendSmtpEmail.htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background-color: #f9f9f9; }
              .reason-box { background: white; padding: 15px; margin: 20px 0; border-left: 3px solid #dc3545; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Account Review Update</h1>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for applying to TradeZy. After reviewing your application, we need additional information to proceed.</p>
                ${reason ? `
                  <div class="reason-box">
                    <strong>Feedback:</strong>
                    <p>${reason}</p>
                  </div>
                ` : ''}
                <p>Please contact our support team at support@tradezy.com for assistance with your application.</p>
              </div>
            </div>
          </body>
          </html>
        `;
      }

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Account status email sent', { to, status, messageId: (result.body as any).messageId });
    } catch (error: any) {
      logger.error('Failed to send account status email', { 
        to, 
        status,
        error: error.message,
        response: error.response?.body 
      });
    }
  }
}

export default new EmailService();