
import {  NextResponse } from 'next/server';
import { serialize } from 'cookie';


export async function POST() {
    
 try {
     // Clear the 'auth_token' cookie by setting it with an empty value and maxAge to 0
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Clear the cookie by setting its maxAge to 0
  });
 
  const response = NextResponse.json({
    msg: 'Cookie cleared',
  });

  response.headers.set('Set-Cookie', cookie);
  
  return response;
 } catch (error) {
    console.log(error)
 }
}
