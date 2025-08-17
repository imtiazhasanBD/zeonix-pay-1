import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";


export const dynamic = "force-dynamic";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken?.access;

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const upstream = await fetch(`${baseUrl}/u/wallet/payment-methods/${params.id}/set-primary/`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
  }

  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}
