import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    return NextResponse.json(decoded);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}