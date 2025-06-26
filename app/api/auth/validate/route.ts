import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Invalid Authorization header" }, { status: 400 });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = await auth.verifyIdToken(token);

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      claims: decoded,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}