// Next.js API route: app/api/screen/route.ts
// Proxies requests to Veria (keeps API key server-side)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { address } = await request.json();

  const response = await fetch('https://api.veria.cc/v1/screen', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERIA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: address }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
