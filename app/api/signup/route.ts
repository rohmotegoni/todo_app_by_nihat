import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcrypt";
import { signupSchema } from "@/app/lib/validations";

const JWT_SECRET = process.env.ENV_JWT_SECRET || "your_jwt_secret_key";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedbody = signupSchema.safeParse(body);
  if (parsedbody.success === false) {
    return NextResponse.json(parsedbody.error, { status: 400 });
  }

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(body.password, 10);

  // Create user in Prisma
  const response = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword, // Save hashed password
    },
  });
  const id = response?.id || "";
  const username = response.name;

  // Generate JWT token
  const token = jwt.sign({ username }, JWT_SECRET);

  // Serialize the cookies
  const cookie = serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    path: "/",
  });
  const cookie2 = serialize("userId", id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    path: "/",
  });

  // Return the response and set the cookies
  const responseWithCookie = NextResponse.json({
    msg: "User created",
    data: response,
  });

  // Set the cookies in the response headers
  responseWithCookie.headers.append("Set-Cookie", cookie); // Use append here
  responseWithCookie.headers.append("Set-Cookie", cookie2); // Use append here

  return responseWithCookie;
}
