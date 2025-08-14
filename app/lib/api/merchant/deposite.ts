import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";

// --- Types for withdraw requests (matches your sample) ---
export type ApiWithdrawRequest = {
    id: number
    invoice_payment_id: string
    data: { key: string; code: string }
    method_payment_id: string
    customer_order_id: string
    customer_name: string
    customer_number: string
    customer_amount: string
    customer_email: string
    customer_address: string
    customer_description: string | null
    method: string            // e.g. "bkash"
    status: string            // e.g. "active" | "inactive" | "pending"
    pay_status: string        // e.g. "paid" | "unpaid" | "failed"
    transaction_id: string
    invoice_trxn: string
    extras: unknown | null
    created_at: string
    merchant: number
};

// Accepts: array, envelope { data: [] }, or single object
function normalizeWithdrawResponse(json: unknown): ApiWithdrawRequest[] {
    if (Array.isArray(json)) return json as ApiWithdrawRequest[];

    if (json && typeof json === "object") {
        const o = json as any;
        if (Array.isArray(o.data)) return o.data as ApiWithdrawRequest[];
        // single object case
        if ("id" in o && "trx_uuid" in o && "amount" in o) {
            return [o as ApiWithdrawRequest];
        }
    }
    throw new Error("Unexpected API shape for withdraw requests");
}

export async function getDepositList(): Promise<ApiWithdrawRequest[]> {
    const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.68.124:8000/api/v1";

    const session = await getServerSession(authOptions);
    // Support either a raw token string or an object with { access }
    const token =
        (session as any)?.accessToken?.access ??
        (session as any)?.accessToken ??
        (session as any)?.user?.token;

    if (!token) {
        throw new Error("Not authenticated: missing access token");
    }

    const res = await fetch(`${baseUrl}/u/invoice/invoices/`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        // Read text so you see the backend message in logs if any
        const text = await res.text().catch(() => "");
        throw new Error(
            `Failed to fetch withdraw requests: ${res.status} ${res.statusText} ${text}`
        );
    }

    const json: unknown = await res.json();
    return normalizeWithdrawResponse(json);
}
