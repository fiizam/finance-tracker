import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD || import.meta.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Finance Journal" <${process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL}>`,
    to,
    subject: 'Verifikasi Akun Finance Journal Anda',
    text: `Terima kasih telah bergabung dengan Finance Journal!\n\nKode verifikasi Anda adalah: ${code}\n\nMasukkan kode ini di aplikasi untuk mengaktifkan akun Anda.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <div style="background-color: #0d4734; padding: 32px 24px; text-align: center;">
            <div style="display: inline-block; background-color: #ffffff; color: #0d4734; width: 48px; height: 48px; line-height: 48px; border-radius: 8px; font-weight: bold; font-size: 24px; margin-bottom: 16px;">F</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Finance Journal</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <h2 style="color: #111827; margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 600;">Verifikasi Email Anda</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
              Terima kasih telah bergabung! Untuk menjaga keamanan akun Anda, silakan masukkan 6 digit kode keamanan di bawah ini pada halaman verifikasi.
            </p>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 700; color: #0d4734; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Jika Anda tidak merasa mendaftar di Finance Journal, Anda dapat mengabaikan email ini dengan aman.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Finance Journal. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD || import.meta.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Finance Journal" <${process.env.SMTP_EMAIL || import.meta.env.SMTP_EMAIL}>`,
    to,
    subject: 'Reset Password Akun Anda',
    text: `Permintaan reset password!\n\nKode reset Anda adalah: ${code}\n\nMasukkan kode ini di aplikasi untuk mengubah password Anda. Jika Anda tidak memintanya, abaikan email ini.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <div style="background-color: #0d4734; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Reset Password</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
              Kami menerima permintaan untuk mereset password akun Finance Journal Anda. Gunakan 6 digit kode keamanan di bawah ini untuk membuat password baru.
            </p>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 700; color: #0d4734; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="color: #ef4444; font-size: 14px; line-height: 1.5; margin-bottom: 0; font-weight: 500;">
              Jika Anda tidak meminta reset password ini, abaikan email ini dan akun Anda akan tetap aman. Jangan beritahu kode ini ke siapapun.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Finance Journal. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
