import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lucio32@ethereal.email",
    pass: "6WKXuCSUDVvaWPq27b",
  },
});
