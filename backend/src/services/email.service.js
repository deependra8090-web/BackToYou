const nodemailer = require("nodemailer");

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production: use real Gmail SMTP
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development: use Ethereal (fake SMTP — preview links in console)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Ethereal test account:", testAccount.user);
  }

  return transporter;
}

function getBaseTemplate(title, bodyHtml) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 0; }
      .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(79,70,229,0.12); }
      .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 40px; text-align: center; }
      .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
      .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 14px; }
      .body { padding: 32px 40px; color: #374151; }
      .body h2 { font-size: 20px; color: #1f2937; margin-bottom: 12px; }
      .body p { font-size: 15px; line-height: 1.6; color: #6b7280; }
      .card { background: #f8faff; border: 1px solid #e0e7ff; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
      .card strong { color: #4f46e5; }
      .btn { display: inline-block; margin: 24px 0 0; padding: 14px 32px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; }
      .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px; text-align: center; color: #9ca3af; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <h1>🔄 BackToYou</h1>
        <p>Lost &amp; Found — Smarter, Faster, Together</p>
      </div>
      <div class="body">${bodyHtml}</div>
      <div class="footer">© 2026 BackToYou · <a href="#" style="color:#4f46e5">Unsubscribe</a></div>
    </div>
  </body>
  </html>
  `;
}

async function sendEmail({ to, subject, html }) {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || '"BackToYou" <noreply@backtoyou.app>',
      to,
      subject,
      html,
    });
    // Log Ethereal preview URL in dev
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("📧 Email preview:", previewUrl);
    return info;
  } catch (err) {
    console.error("Email send error:", err.message);
  }
}

async function sendMatchFoundEmail({ userEmail, userName, lostItemTitle, foundItemTitle, matchScore, appUrl }) {
  const html = getBaseTemplate(
    "A Match Was Found!",
    `
    <h2>🎉 Great news, ${userName}!</h2>
    <p>We found a potential match for your item. Here are the details:</p>
    <div class="card">
      <p><strong>Your Item:</strong> ${lostItemTitle}</p>
      <p><strong>Matched With:</strong> ${foundItemTitle}</p>
      <p><strong>Match Score:</strong> ${matchScore}%</p>
    </div>
    <p>Log in to BackToYou to review the match, chat with the finder, and start the recovery process.</p>
    <a class="btn" href="${appUrl || '#'}/mymatches">View My Matches →</a>
    `
  );
  return sendEmail({ to: userEmail, subject: "🎉 BackToYou — A match was found for your item!", html });
}

async function sendClaimUpdateEmail({ userEmail, userName, itemTitle, claimStatus }) {
  const emoji = claimStatus === "approved" ? "✅" : claimStatus === "rejected" ? "❌" : "🔄";
  const html = getBaseTemplate(
    "Claim Status Update",
    `
    <h2>${emoji} Claim ${claimStatus}</h2>
    <p>Hi ${userName}, your claim for the following item has been updated:</p>
    <div class="card">
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p><strong>Status:</strong> <strong>${claimStatus.toUpperCase()}</strong></p>
    </div>
    <p>${claimStatus === "approved" ? "Please coordinate with the admin to retrieve your item." : "If you believe this is a mistake, please contact support."}</p>
    <a class="btn" href="#/myclaims">View My Claims →</a>
    `
  );
  return sendEmail({ to: userEmail, subject: `${emoji} BackToYou — Claim ${claimStatus}`, html });
}

async function sendItemVerifiedEmail({ userEmail, userName, itemTitle, itemType }) {
  const html = getBaseTemplate(
    "Item Verified!",
    `
    <h2>✅ Your ${itemType} item has been verified!</h2>
    <p>Hi ${userName}, your reported item has been reviewed and approved by our admin team.</p>
    <div class="card">
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p><strong>Type:</strong> ${itemType}</p>
      <p><strong>Status:</strong> Approved &amp; Active</p>
    </div>
    <p>Your item is now visible to other users and the AI matching engine will start looking for matches.</p>
    <a class="btn" href="#/dashboard">Go to Dashboard →</a>
    `
  );
  return sendEmail({ to: userEmail, subject: "✅ BackToYou — Your item has been verified!", html });
}

module.exports = { sendMatchFoundEmail, sendClaimUpdateEmail, sendItemVerifiedEmail, sendEmail };
