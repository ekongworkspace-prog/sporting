import { Resend } from "resend";

import {env} from "../../config/env.js";
import { generateQrCode } from "../../utils/qrcode.js";

const resend = new Resend(env.RESEND_API_KEY);
const from =env.RESEND_FROM_EMAIL

export async function sendClubInvitation({
  email,
  clubName,
  ownerName,
}: {
  email: string;
  clubName: string;
  ownerName: string;
}): Promise<void> {
  await resend.emails.send({
    from: from,
    to: email,
    subject: `You have been invited to join ${clubName}`,
    html: `
      <h2>${clubName} invited you to join their team</h2>
      <p>${ownerName} added you as a player to consider joining ${clubName}.</p>
      <p><a href="${env.FRONTEND_URL}/sign-up?invite=club">Accept the invite and create your account</a></p>
      <p>— Turf Club Nigeria</p>
    `,
  });
}

export const sendOtpEmail = async ({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: string;
}): Promise<void> => {
  const isPasswordReset = type === "forget-password";

  await resend.emails.send({
    from: from,
    to: email,
    subject: isPasswordReset
      ? "Reset your Club password"
      : "Verify your Club account",
    html: `
    <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
    <title>Player verification</title>
    <style>
      @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
    </style>
  </head>
      <div
        style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto;
        "
      >
        <h2>
          ${
            isPasswordReset
              ? "Reset your Club password"
              : "Verify your Club account"
          }
        </h2>

        <p>
          ${
            isPasswordReset
              ? "Use the verification code below to reset your password."
              : "Use the verification code below to verify your email address."
          }
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          "
        >
          ${otp}
        </div>

        <p>
          This code expires in 5 minutes.
        </p>

        <p>
          If you didn't request this, you can safely ignore this email.
        </p>

        <p>
          — Turf Club Nigeria.
        </p>
      </div>
    `,
  });
};