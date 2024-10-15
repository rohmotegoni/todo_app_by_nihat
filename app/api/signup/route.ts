import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { signupSchema } from '@/app/utils/validations';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.ENV_JWT_SECRET || "your_jwt_secret_key"; 
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = signupSchema.safeParse(body);

  // Validate incoming data
  if (!parsedBody.success) {
    return NextResponse.json({ msg: "Enter valid data" }, { status: 400 });
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

    const username = body.name;
    
    // Generate JWT token
    const token = jwt.sign({ username }, JWT_SECRET);

    // Serialize the cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      path: '/',
    });

    // Return the response and set the cookie
    const responseWithCookie = NextResponse.json({
      msg: 'User created',
      data: response,
    });

    // Set the cookie in the response headers
    responseWithCookie.headers.set('Set-Cookie', cookie);
    
    return responseWithCookie;

  
}
