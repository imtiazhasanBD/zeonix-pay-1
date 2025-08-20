import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; 

export async function PUT(req: Request) {
  const baseUrl = process.env.BASE_URL
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);


  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
console.log(payload);

  const upstream = await fetch(`${baseUrl}/profile/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
  }
  console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaa:",data);
  
  return NextResponse.json(data ?? { ok: true }, { status: upstream.status || 200 });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "merchant-payment-methods route aliveeeeeeeeeee" });
}
