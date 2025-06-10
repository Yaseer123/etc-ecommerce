import { db } from "@/server/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function generateRandomPassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      // Optionally, send a 'you already have an account' email here
      return NextResponse.json({ message: "User already exists." });
    }
    // Generate password and hash
    const password = generateRandomPassword();
    const hashedPassword = await hash(password, 10);
    // Create user
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    // Send welcome email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #007b55; color: #fff; padding: 24px 32px;">
          <h2 style="margin: 0;">Welcome to Rinors Ecommerce!</h2>
        </div>
        <div style="padding: 24px 32px;">
          <p style="font-size: 16px;">Hi ${name || "there"},</p>
          <p style="font-size: 16px;">We have created an account for you. Here are your credentials:</p>
          <ul style="font-size: 16px;">
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p style="font-size: 16px;">You can log in and change your password at any time.</p>
          <div style="margin-top: 32px;">
            <a href="${APP_URL}/login" style="background: #007b55; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Login to Your Account</a>
          </div>
        </div>
      </div>
    `;
    await resend.emails.send({
      from: "no-reply@rinors.com",
      to: email,
      subject: "Your new account at Rinors Ecommerce",
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to auto-register user." },
      { status: 500 },
    );
  }
}
