import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Cors from 'cors';
// import initMiddleware from '../../../pages/init-middleware'; // Update this path based on your folder structure
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { signupSchema } from '@/app/utils/validations';

const JWT_SECRET = process.env.ENV_JWT_SECRET || "your_jwt_secret_key"; 
const prisma = new PrismaClient();

// Initialize CORS middleware
// const cors = initMiddleware(
//   Cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   })
// );

  /**
   * Create a new user with the given name, email, and password.
   * @param {NextRequest} req - The request object
   * @returns {Promise<NextResponse>} - The response with the created user and a JSON Web Token in the Set-Cookie header
   */
export async function POST(req: NextRequest) {
  let body = await req.json();
let parsedbody = signupSchema.safeParse(body)
if (!parsedbody.success) {
  return NextResponse.json({ msg: "enter a valid data" }, { status: 400 });
}
  // Create user in Prisma
  let response = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  const username = body.name;
  
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
