async function sendNotificationEmail({ to, subject, templateName, data }) {
  console.log(`📧 [EMAIL] To: ${to} | Subject: "${subject}"`);
  return { success: true, messageId: "msg_email_" + Date.now() };
}

module.exports = { sendNotificationEmail };
