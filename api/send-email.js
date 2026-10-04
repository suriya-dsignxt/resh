import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sender, type } = req.body || {};

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'packmycake@gmail.com',
        pass: 'onlhkcpnbsutjing'
      }
    });

    const isCompletion = type === 'completion';
    const subject = isCompletion
      ? '🏆 Reshmi & Suriya - Memory Vault Unlocked!'
      : '💌 New Note from Reshmi - Memory Quest';

    const textContent = `
${isCompletion ? '🎉 The Final Memory Vault was unlocked!' : '💌 A new message was submitted on the Memory Quest:'}

From: ${sender || 'Reshmi'}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Message:
--------------------------------------------------
${message || '(No text submitted)'}
--------------------------------------------------

Sent via Reshmi & Suriya Memory Quest
`;

    const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 3px solid #eb6f92; border-radius: 8px; background-color: #0f172a; color: #e0def4;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #eb6f92; margin: 0; font-size: 24px;">
      ${isCompletion ? '🏆 Memory Vault Completed!' : '💌 New Guestbook Message'}
    </h1>
    <p style="color: #908caa; font-size: 12px; margin-top: 5px;">RESHMI & SURIYA MEMORY QUEST</p>
  </div>

  <div style="background-color: #191724; border: 2px solid #eb6f92; border-radius: 6px; padding: 16px; margin: 20px 0;">
    <p style="color: #ea9d34; font-size: 12px; margin-top: 0; font-weight: bold;">
      FROM: ${sender || 'Reshmi'}
    </p>
    <div style="color: #ffffff; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
${message || '(No message content)'}
    </div>
  </div>

  <p style="text-align: center; font-size: 11px; color: #908caa; margin-top: 24px; border-top: 1px solid #26233a; padding-top: 12px;">
    ✨ Delivered with love by Reshmi & Suriya App ✨
  </p>
</div>
`;

    const info = await transporter.sendMail({
      from: '"Memory Quest" <packmycake@gmail.com>',
      to: 'sekarsuriya16@gmail.com',
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    console.log('Email sent successfully to sekarsuriya16@gmail.com:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
