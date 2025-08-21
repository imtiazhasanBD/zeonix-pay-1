import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST handler for generating API key
export async function POST(req: Request) {
    const baseUrl = process.env.BASE_URL;
    const session = await getServerSession(authOptions);
    const token = getAccessToken(session);

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    console.log(payload);

    const upstream = await fetch(`${baseUrl}/app/keys/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const text = await upstream.text();
    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!upstream.ok) {
        return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
    }

    return NextResponse.json(data ?? { ok: true }, { status: 200 });
}

// PATCH handler for toggling API key active status
export async function PATCH(req: Request) {
    const baseUrl = process.env.BASE_URL;
    const session = await getServerSession(authOptions);
    const token = getAccessToken(session);

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { is_active } = await req.json();
    console.log(`Updating API key to active status to: ${is_active}`);

    if (typeof is_active !== "boolean") {
        return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const upstream = await fetch(`${baseUrl}/app/keys/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active }),
        cache: "no-store",
    });

    const text = await upstream.text();
    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!upstream.ok) {
        return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
    }

    return NextResponse.json(data ?? { ok: true }, { status: 200 });
}

// GET handler for checking route health
export async function GET() {
    return NextResponse.json({ ok: true, hint: "route-aliveeeeeeeeeee" });
}
