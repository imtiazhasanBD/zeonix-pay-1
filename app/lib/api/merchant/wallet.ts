import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";

export async function getWalletTransactions() {

  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken?.access;

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${baseUrl}/u/wallet/wallet-transaction/`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
