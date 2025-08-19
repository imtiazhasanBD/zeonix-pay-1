import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Params = Promise<{ id: string }>;

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  const { id } = await params;


  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(`${baseUrl}/u/wallet/payment-methods/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  // Some APIs return 204 No Content on successful delete
  if (upstream.status === 204) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const text = await upstream.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!upstream.ok) {
    return NextResponse.json(
      { message: "Upstream error", details: data ?? null },
      { status: upstream.status }
    );
  }

  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}
