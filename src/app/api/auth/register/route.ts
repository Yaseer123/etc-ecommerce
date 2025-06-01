import { db } from "@/server/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
export const config = { runtime: "nodejs" };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email: string;
      password: string;
      name?: string;
    };
    const email: string = body.email;
    const password: string = body.password;
    const name: string | undefined = body.name;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    if (typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid password type." },
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
    if (typeof hash !== "function") {
      return NextResponse.json(
        { error: "Hash function is not available." },
        { status: 500 },
      );
    }
    const hashedPassword: string = await hash(password, 10);
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
  } catch (_) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
