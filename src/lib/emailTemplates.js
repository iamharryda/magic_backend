import sendEmail from './sendEmail.js';
import { adminEmail } from '../core/config/config.js';

const createEmailLayout = (title, content, color = '#4a0e0e') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f5f3; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f5f3; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" max-width="600px" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); max-width: 600px; margin: 0 auto;">
          <tr>
            <td style="background-color: #4a0e0e; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">MAGIC INITIATIVE</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: ${color}; margin-top: 0; margin-bottom: 24px; font-size: 22px;">${title}</h2>
              <div style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${content}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; padding: 24px 30px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0; color: #4a0e0e; font-size: 14px; font-weight: 600;">We are deeply grateful for your support.</p>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Magic Initiative. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Send donation confirmation emails to both Donor and Admin
 */
export const sendDonationEmails = async ({ donorEmail, donorName, amount, currency, message }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  const donorHtml = createEmailLayout(
    'Thank You for Your Donation',
    `<p>Dear <strong>${donorName || 'Generous Donor'}</strong>,</p>
     <p>We have successfully received your one-time donation of <strong style="color: #4a0e0e; font-size: 18px;">$${formattedAmount}</strong>.</p>
     ${message ? `<p style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #4a0e0e; font-style: italic;">"${message}"</p>` : ''}
     <p>Your support makes a huge difference in transforming lives. Thank you for your incredible generosity!</p>`,
    '#10B981'
  );

  const adminHtml = createEmailLayout(
    'New Donation Received',
    `<p><strong>Donor Name:</strong> ${donorName || 'N/A'}</p>
     <p><strong>Donor Email:</strong> ${donorEmail || 'N/A'}</p>
     <p><strong>Amount:</strong> $${formattedAmount}</p>
     ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}`,
    '#10B981'
  );

  const results = [];
  if (donorEmail) {
    results.push(await sendEmail({ to: donorEmail, subject: 'Magic Initiative - Thank You for Your Donation', html: donorHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - New Donation: $${formattedAmount}`, html: adminHtml }));
  }
  return results;
};

/**
 * Send donation failure emails to both Donor and Admin
 */
export const sendDonationFailureEmails = async ({ donorEmail, donorName, amount, currency, errorReason }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;

  const donorHtml = createEmailLayout(
    'Donation Processing Failed',
    `<p>Dear <strong>${donorName || 'Donor'}</strong>,</p>
     <p>We were unable to process your donation of <strong>$${formattedAmount}</strong>.</p>
     <p style="color: #EF4444;"><strong>Reason:</strong> ${errorReason || 'Authorization failed or was cancelled'}</p>
     <p>Please try again or update your details. Your support means everything to us!</p>`,
    '#EF4444'
  );

  const adminHtml = createEmailLayout(
    'Alert: Donation Processing Failed',
    `<p><strong>Donor Name:</strong> ${donorName || 'N/A'}</p>
     <p><strong>Donor Email:</strong> ${donorEmail || 'N/A'}</p>
     <p><strong>Attempted Amount:</strong> $${formattedAmount}</p>
     <p><strong>Error Reason:</strong> ${errorReason || 'Unknown error / Cancelled'}</p>`,
    '#EF4444'
  );

  const results = [];
  if (donorEmail) {
    results.push(await sendEmail({ to: donorEmail, subject: 'Magic Initiative - Donation Processing Update', html: donorHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - Donation Failed: $${formattedAmount}`, html: adminHtml }));
  }
  return results;
};

/**
 * Send subscription setup confirmation emails to both Subscriber and Admin
 */
export const sendSubscriptionSetupEmails = async ({ sponsorEmail, sponsorName, childId, childName, amount, currency }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;
  const childDisplay = childName ? childName : (childId ? `ID: ${childId}` : '');

  const subscriberHtml = createEmailLayout(
    'Child Sponsorship Confirmed',
    `<p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
     <p>Thank you for sponsoring a child! Your monthly sponsorship subscription of <strong style="color: #4a0e0e; font-size: 18px;">$${formattedAmount}/month</strong> has been successfully initiated.</p>
     ${childDisplay ? `<p><strong>Sponsored Child:</strong> ${childDisplay}</p>` : ''}
     <p>Your initial contribution was processed successfully. Your method has been saved securely, and future charges will be automatically processed on a monthly basis.</p>`,
    '#10B981'
  );

  const adminHtml = createEmailLayout(
    'New Child Sponsorship Subscribed',
    `<p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
     <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
     <p><strong>Monthly Amount:</strong> $${formattedAmount}/month</p>
     ${childDisplay ? `<p><strong>Child:</strong> ${childDisplay}</p>` : ''}
     <p>Method saved and initial setup completed.</p>`,
    '#10B981'
  );

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Magic Initiative - Child Sponsorship Confirmed', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - New Monthly Sponsorship: $${formattedAmount}/mo`, html: adminHtml }));
  }
  return results;
};

/**
 * Send subscription setup failure emails to both Subscriber and Admin
 */
export const sendSubscriptionSetupFailureEmails = async ({ sponsorEmail, sponsorName, childId, childName, amount, currency, errorReason }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;
  const childDisplay = childName ? childName : (childId ? `ID: ${childId}` : '');

  const subscriberHtml = createEmailLayout(
    'Child Sponsorship Setup Failed',
    `<p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
     <p>We were unable to complete the setup for your monthly sponsorship of <strong>$${formattedAmount}/month</strong>.</p>
     ${childDisplay ? `<p><strong>Child:</strong> ${childDisplay}</p>` : ''}
     <p style="color: #EF4444;"><strong>Reason:</strong> ${errorReason || 'Authorization failed or was cancelled'}</p>
     <p>Please try again to continue supporting your sponsored child.</p>`,
    '#EF4444'
  );

  const adminHtml = createEmailLayout(
    'Alert: Child Sponsorship Setup Failed',
    `<p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
     <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
     <p><strong>Attempted Amount:</strong> $${formattedAmount}/month</p>
     ${childDisplay ? `<p><strong>Child:</strong> ${childDisplay}</p>` : ''}
     <p><strong>Error Reason:</strong> ${errorReason || 'Unknown error / Cancelled'}</p>`,
    '#EF4444'
  );

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Magic Initiative - Sponsorship Setup Update', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - Sponsorship Setup Failed: $${formattedAmount}/mo`, html: adminHtml }));
  }
  return results;
};

/**
 * Send monthly cron charge success emails to Subscriber and Admin
 */
export const sendMonthlyChargeSuccessEmails = async ({ sponsorEmail, sponsorName, childId, childName, amount, currency }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;
  const childDisplay = childName ? childName : (childId ? `ID: ${childId}` : '');

  const subscriberHtml = createEmailLayout(
    'Monthly Sponsorship Receipt',
    `<p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
     <p>Your recurring monthly contribution of <strong style="color: #4a0e0e; font-size: 18px;">$${formattedAmount}</strong> for child sponsorship ${childDisplay ? `(${childDisplay})` : ''} was processed successfully.</p>
     <p>Thank you for continuing to make a difference in their lives!</p>`,
    '#10B981'
  );

  const adminHtml = createEmailLayout(
    'Monthly Subscription Renewed',
    `<p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
     <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
     <p><strong>Amount Charged:</strong> $${formattedAmount}</p>
     ${childDisplay ? `<p><strong>Child:</strong> ${childDisplay}</p>` : ''}`,
    '#10B981'
  );

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Magic Initiative - Monthly Sponsorship Receipt', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - Monthly Renewal Success: $${formattedAmount}`, html: adminHtml }));
  }
  return results;
};

/**
 * Send monthly cron charge failure emails to Subscriber and Admin
 */
export const sendMonthlyChargeFailureEmails = async ({ sponsorEmail, sponsorName, childId, childName, amount, currency, errorReason }) => {
  const formattedAmount = `${amount} ${currency.toUpperCase()}`;
  const childDisplay = childName ? childName : (childId ? `ID: ${childId}` : '');

  const subscriberHtml = createEmailLayout(
    'Monthly Sponsorship Processing Failed',
    `<p>Dear <strong>${sponsorName || 'Sponsor'}</strong>,</p>
     <p>We were unable to process your automatic monthly contribution of <strong>$${formattedAmount}</strong> for child sponsorship ${childDisplay ? `(${childDisplay})` : ''}.</p>
     <p style="color: #EF4444;"><strong>Reason:</strong> ${errorReason || 'Authorization failed'}</p>
     <p>Please update your details or contact us to ensure your sponsored child continues to receive support.</p>`,
    '#EF4444'
  );

  const adminHtml = createEmailLayout(
    'Alert: Monthly Renewal Failed',
    `<p><strong>Sponsor Name:</strong> ${sponsorName || 'N/A'}</p>
     <p><strong>Sponsor Email:</strong> ${sponsorEmail}</p>
     <p><strong>Attempted Amount:</strong> $${formattedAmount}</p>
     ${childDisplay ? `<p><strong>Child:</strong> ${childDisplay}</p>` : ''}
     <p><strong>Error Reason:</strong> ${errorReason || 'Unknown error'}</p>`,
    '#EF4444'
  );

  const results = [];
  if (sponsorEmail) {
    results.push(await sendEmail({ to: sponsorEmail, subject: 'Magic Initiative - Monthly Sponsorship Update', html: subscriberHtml }));
  }
  if (adminEmail) {
    results.push(await sendEmail({ to: adminEmail, subject: `Magic Initiative - Monthly Renewal Failed: $${formattedAmount}`, html: adminHtml }));
  }
  return results;
};

/**
 * Verification Code / OTP HTML Template for Auth
 */
export const verificationCodeTemplate = (code) => {
  return createEmailLayout(
    'Your Verification Code',
    `<p>Please use the following OTP code to proceed:</p>
     <div style="font-size: 32px; font-weight: bold; color: #10B981; margin: 25px 0; letter-spacing: 4px; text-align: center; background: #f3f4f6; padding: 15px; border-radius: 8px;">${code}</div>
     <p>This code will expire shortly. If you did not request this, please ignore this email.</p>`,
    '#4F46E5'
  );
};

export default verificationCodeTemplate;
