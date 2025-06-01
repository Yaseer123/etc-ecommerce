import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: { id: user.id, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
