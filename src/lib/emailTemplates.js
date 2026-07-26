import sendEmail from './sendEmail.js';
import { adminEmail } from '../core/config/config.js';

/**
 * Send donation confirmation emails to both Donor and Admin
 */
export const sendDonationEmails = async ({ donorEmail, donorName, amount, currency, message }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  // Donor Email
  const donorHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Thank You for Your Donation!</h2>
      <p>Dear <strong>${donorName || 'Generous Donor'}</strong>,</p>
      <p>We have successfully received your one-time donation of <strong>$${formattedAmount}</strong>.</p>
      ${message ? `<p><em>"${message}"</em></p>` : ''}
      <p>Your support makes a huge difference. Thank you for your generosity!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative Team</p>
    </div>
  `;

  // Admin Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #10B981;">New Donation Received 🎉</h2>
      <p><strong>Donor Name:</strong> ${donorName || 'N/A'}</p>
      <p><strong>Donor Email:</strong> ${donorEmail || 'N/A'}</p>
      <p><strong>Amount:</strong> $${formattedAmount}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative System Notification</p>
    </div>
  `;

  const results = [];
  if (donorEmail) {
    results.push(await sendEmail({ to: donorEmail, subject: 'Thank you for your donation!', html: donorHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `New Donation Received: $${formattedAmount} from ${donorName || donorEmail || 'Donor'}`, html: adminHtml }));
  }

  return results;
};

/**
 * Send subscription setup confirmation emails to both Subscriber and Admin
 */
export const sendSubscriptionSetupEmails = async ({ sponsorEmail, sponsorName, childId, amount, currency }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  // Subscriber Email
  const subscriberHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Child Sponsorship Confirmed! ❤️</h2>
      <p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
      <p>Thank you for sponsoring a child! Your monthly sponsorship subscription of <strong>$${formattedAmount}/month</strong> has been successfully initiated and your initial payment processed.</p>
      ${childId ? `<p><strong>Child ID:</strong> ${childId}</p>` : ''}
      <p>Your payment method has been saved securely, and future charges of $${formattedAmount} will be automatically processed on a monthly basis.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative Team</p>
    </div>
  `;

  // Admin Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #10B981;">New Child Sponsorship Subscribed! 🌟</h2>
      <p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
      <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
      <p><strong>Monthly Amount:</strong> $${formattedAmount}/month</p>
      ${childId ? `<p><strong>Child ID:</strong> ${childId}</p>` : ''}
      <p>Payment method saved and initial payment completed.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative System Notification</p>
    </div>
  `;

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Child Sponsorship Subscription Confirmed!', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `New Monthly Sponsorship: $${formattedAmount}/mo by ${sponsorName || sponsorEmail}`, html: adminHtml }));
  }

  return results;
};

/**
 * Send monthly cron charge success emails to Subscriber and Admin
 */
export const sendMonthlyChargeSuccessEmails = async ({ sponsorEmail, sponsorName, childId, amount, currency }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  // Subscriber Email
  const subscriberHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Monthly Sponsorship Payment Receipt</h2>
      <p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
      <p>Your recurring monthly payment of <strong>$${formattedAmount}</strong> for child sponsorship ${childId ? `(Child ID: ${childId})` : ''} was processed successfully.</p>
      <p>Thank you for continuing to make a difference!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative Team</p>
    </div>
  `;

  // Admin Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #10B981;">Monthly Subscription Renewed 🔄</h2>
      <p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
      <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
      <p><strong>Amount Charged:</strong> $${formattedAmount}</p>
      ${childId ? `<p><strong>Child ID:</strong> ${childId}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative System Notification</p>
    </div>
  `;

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Monthly Sponsorship Payment Receipt', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Monthly Renewal Success: $${formattedAmount} (${sponsorEmail})`, html: adminHtml }));
  }

  return results;
};

/**
 * Send monthly cron charge failure emails to Subscriber and Admin
 */
export const sendMonthlyChargeFailureEmails = async ({ sponsorEmail, sponsorName, childId, amount, currency, errorReason }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  // Subscriber Email
  const subscriberHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #EF4444;">Monthly Sponsorship Payment Failed</h2>
      <p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
      <p>We were unable to process your monthly payment of <strong>$${formattedAmount}</strong> for child sponsorship ${childId ? `(Child ID: ${childId})` : ''}.</p>
      <p>Reason: ${errorReason || 'Payment authorization failed'}</p>
      <p>Please update your payment details or contact us to continue supporting your sponsored child.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative Team</p>
    </div>
  `;

  // Admin Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #EF4444;">Alert: Monthly Renewal Payment Failed ⚠️</h2>
      <p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
      <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
      <p><strong>Attempted Amount:</strong> $${formattedAmount}</p>
      ${childId ? `<p><strong>Child ID:</strong> ${childId}</p>` : ''}
      <p><strong>Error Reason:</strong> ${errorReason || 'Unknown error'}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Magic Initiative System Notification</p>
    </div>
  `;

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Action Required: Monthly Sponsorship Payment Failed', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Monthly Renewal FAILED: $${formattedAmount} (${sponsorEmail})`, html: adminHtml }));
  }

  return results;
};

/**
 * Verification Code / OTP HTML Template for Auth
 */
export const verificationCodeTemplate = (code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5;">Your Verification Code</h2>
      <p>Please use the following OTP code to proceed:</p>
      <div style="font-size: 24px; font-weight: bold; color: #10B981; margin: 15px 0;">${code}</div>
      <p>This code will expire shortly. If you did not request this, please ignore this email.</p>
    </div>
  `;
};

export default verificationCodeTemplate;
