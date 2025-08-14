import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";


// --- Types ---
export type ApiTransaction = {
  id: number;
  object_id: number;
  amount: string;
  method: string;
  status: string;  
  created_at: string;
  trx_id: string;
  trx_uuid: string;
  tran_type: string; 
  wallet: number;
  merchant: number;
  content_type: number;
};

export type WalletTransactionsResponse = {
  status: boolean;
  count: number;
  data: ApiTransaction[];
};

// --- Narrowing helper (runtime safety, optional but nice) ---
function isWalletTransactionsResponse(x: unknown): x is WalletTransactionsResponse {
  return (
    typeof x === "object" &&
    x !== null &&
    "status" in x &&
    "count" in x &&
    "data" in x &&
    Array.isArray((x as any).data)
  );
}

export async function getWalletTransactions(): Promise<WalletTransactionsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.68.124:8000/api/v1";
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken?.access;

  if (!token) {
    throw new Error("Not authenticated: missing access token");
  }

  const res = await fetch(`${baseUrl}/u/wallet/wallet-transaction/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch wallet transactions: ${res.status} ${res.statusText}`);
  }

  const json: unknown = await res.json();

  if (!isWalletTransactionsResponse(json)) {
    throw new Error("Unexpected API shape for wallet transactions");
  }

  return json;
}
