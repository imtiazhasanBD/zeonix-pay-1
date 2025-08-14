import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";


type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

// --- Types for withdraw requests (matches your sample) ---
export type ApiWithdrawRequest = {
    id: number;
    method_type: MethodType;
    params: {
        account_name: string;
        account_number: string;
    };
    status: string;       // "active" | "inactive" | "pending" | ...
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    merchant: number;
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

export async function getPaymentMethodList(): Promise<ApiWithdrawRequest[]> {
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

    const res = await fetch(`${baseUrl}/u/wallet/payment-methods/`, {
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
