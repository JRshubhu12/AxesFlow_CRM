// API route for generating email campaigns has been removed or disabled.
// The backend logic for AI email generation is currently not active.

/*
import { NextRequest, NextResponse } from 'next/server';
// Original API route content would be here, likely using a GenAI SDK
*/

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: "AI campaign generation is currently unavailable." },
    { status: 503 }
  );
}
