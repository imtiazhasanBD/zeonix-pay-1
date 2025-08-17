import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken?.access;

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  console.log(payload)
  const upstream = await fetch(`${baseUrl}/u/wallet/withdraw-request/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  console.log(upstream);
  

  const text = await upstream.text();
  let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!upstream.ok) {
    return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
  }
  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "route-aliveeeeeeeeeee" });
}