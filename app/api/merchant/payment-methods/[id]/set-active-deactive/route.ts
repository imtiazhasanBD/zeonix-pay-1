import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";


export const dynamic = "force-dynamic";
type Params = Promise<{ id: string }>;

export async function PATCH(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const upstream = await fetch(`${baseUrl}/u/wallet/payment-methods/${id}/set-active-deactive/`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
  }

  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}
