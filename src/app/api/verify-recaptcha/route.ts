// src/app/api/verify-recaptcha/route.ts

// This route verifies the reCAPTCHA response sent from the client-side (login/signup form)
// It ensures that the user is human and not a bot by verifying the response with Google's reCAPTCHA API.

import fetch from 'node-fetch'
import { NextApiRequest, NextApiResponse } from 'next'

// Define the type for the request body
interface RecaptchaRequestBody {
  recaptchaResponse: string;
}

// Define the response data type for the reCAPTCHA verification response
interface RecaptchaVerificationResponse {
  success: boolean;
  challenge_ts: string;  // timestamp of the challenge load (not always needed)
  hostname: string;      // the hostname of the site where the reCAPTCHA was solved
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Directly access req.body
  const { recaptchaResponse }: RecaptchaRequestBody = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  const response = await fetch(verifyUrl, { method: 'POST' });

  // Explicitly type-cast the response JSON data as RecaptchaVerificationResponse
  const data: RecaptchaVerificationResponse = await response.json() as RecaptchaVerificationResponse;

  if (!data.success) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
  }

  res.status(200).json({ message: 'Success!' });
}

