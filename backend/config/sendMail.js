import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.pass, // Gmail App Password
  },
});

// Send mail function
const sendMail = async ({ to, otp }) => {
  if (!to) throw new Error("Recipient email missing");
  if (!otp) throw new Error("OTP missing");

  return await transporter.sendMail({
    from: `"AILMS Support" <${process.env.email}>`,
    to,
    subject: "Reset Password OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        <p>Hello,</p>
        <p>Your OTP for resetting password is:</p>
        <h2 style="color: #2c7be5;">${otp}</h2>
        <p>This OTP expires in <b>10 minutes</b>.</p>
        <br/>
        <p>Regards,<br/>AILMS Team</p>
      </div>
    `,
  });
};

export default sendMail;
