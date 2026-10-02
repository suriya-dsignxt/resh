import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'

const emailDevPlugin = () => ({
  name: 'email-dev-plugin',
  configureServer(server) {
    server.middlewares.use('/api/send-email', async (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { message, sender, type } = JSON.parse(body || '{}');
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'packmycake@gmail.com',
                pass: 'onlhkcpnbsutjing'
              }
            });

            const isCompletion = type === 'completion';
            const subject = isCompletion
              ? '🏆 Yadhu & Dushee - Memory Vault Unlocked!'
              : '💌 New Note from Dushee - Memory Quest';

            const htmlContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 3px solid #eb6f92; border-radius: 8px; background-color: #0f172a; color: #e0def4;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #eb6f92; margin: 0; font-size: 24px;">
                    ${isCompletion ? '🏆 Memory Vault Completed!' : '💌 New Guestbook Message'}
                  </h1>
                  <p style="color: #908caa; font-size: 12px; margin-top: 5px;">YADHU & DUSHEE MEMORY QUEST</p>
                </div>
                <div style="background-color: #191724; border: 2px solid #eb6f92; border-radius: 6px; padding: 16px; margin: 20px 0;">
                  <p style="color: #ea9d34; font-size: 12px; margin-top: 0; font-weight: bold;">
                    FROM: ${sender || 'Dushee'}
                  </p>
                  <div style="color: #ffffff; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
                    ${message || '(No message content)'}
                  </div>
                </div>
                <p style="text-align: center; font-size: 11px; color: #908caa; margin-top: 24px; border-top: 1px solid #26233a; padding-top: 12px;">
                  ✨ Delivered with love by Yadhu & Dushee App ✨
                </p>
              </div>
            `;

            await transporter.sendMail({
              from: '"Memory Quest" <packmycake@gmail.com>',
              to: 'Yadhusankar108@gmail.com',
              subject: subject,
              text: message || '',
              html: htmlContent
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('Dev email send error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emailDevPlugin()],
})
