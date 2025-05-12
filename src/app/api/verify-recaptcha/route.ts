// src/app/api/verify-recaptcha/route.ts

// This route verifies the reCAPTCHA response sent from the client-side (login/signup form)
// It ensures that the user is human and not a bot by verifying the response with Google's reCAPTCHA API.

import fetch from "node-fetch";
import { NextRequest, NextResponse } from "next/server";

// Define the type for the request body
interface RecaptchaRequestBody {
  recaptchaResponse: string;
}

// Define the response data type for the reCAPTCHA verification response
interface RecaptchaVerificationResponse {
  success: boolean;
  challenge_ts: string; // timestamp of the challenge load (not always needed)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
}

export async function POST(req: NextRequest) {
  // Directly access req.body
  const { recaptchaResponse }: RecaptchaRequestBody = await req.json();

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  const response = await fetch(verifyUrl, { method: "POST" });

  // Explicitly type-cast the response JSON data as RecaptchaVerificationResponse
  const data: RecaptchaVerificationResponse =
    (await response.json()) as RecaptchaVerificationResponse;

  if (!data.success) {
    return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 })
  }

  NextResponse.json({ message: 'success' }, { status: 200 })
}
