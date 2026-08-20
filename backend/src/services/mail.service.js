import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAUTH2",
    user: GOOGLE_USER,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((error) => {
    console.log("Email transporter verification failed");
  });

export async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(info);
}
