/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

let cachedToken: string | null = null;
let cachedExpiry = 0;
let refreshing = false;

export async function GET() {
  if (cachedToken && Date.now() < cachedExpiry) {
    return NextResponse.json({
      access_token: cachedToken,
      expires_in: Math.floor((cachedExpiry - Date.now()) / 1000),
      cached: true,
    });
  }
  if (refreshing) {
    while (refreshing) {
      await new Promise((res) => setTimeout(res, 30));
    }
    if (cachedToken) {
      return NextResponse.json({
        access_token: cachedToken,
        expires_in: Math.floor((cachedExpiry - Date.now()) / 1000),
        cached: true,
      });
    }
  }

  refreshing = true;

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authToken}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      refreshing = false;
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    cachedToken = data.access_token;
    cachedExpiry = Date.now() + data.expires_in * 1000;

    refreshing = false;

    return NextResponse.json({
      access_token: cachedToken,
      expires_in: data.expires_in,
      cached: false,
    });
  } catch (err: any) {
    refreshing = false;
    return NextResponse.json(
      { error: `Internal Server Error: ${err.message}` },
      { status: 500 },
    );
  }
}
