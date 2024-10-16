import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcrypt";
import { signinSchema } from "@/app/lib/validations";

const JWT_SECRET = process.env.ENV_JWT_SECRET || "your_jwt_secret_key"; // Replace with your actual secret key
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedbody = signinSchema.safeParse(body);
  if (parsedbody.success === false) {
    return NextResponse.json(parsedbody.error, { status: 400 });
  }

  const { email, password } = body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const id = user?.id || "";
    // If user not found or password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        {
          msg: "Invalid email or password",
        },
        { status: 401 }
      ); // Return 401 Unauthorized
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.name }, JWT_SECRET);

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

    // Return response and set cookies
    const responseWithCookie = NextResponse.json({
      msg: "Login successful",
      data: user,
    });

    // Set the cookies in the response headers
    responseWithCookie.headers.append("Set-Cookie", cookie); // Use append here
    responseWithCookie.headers.append("Set-Cookie", cookie2); // Use append here

    return responseWithCookie;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
