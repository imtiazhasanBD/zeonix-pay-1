import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { getAccessToken } from "../../getToken";

export async function getWithdrawRequests() {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${baseUrl}/u/wallet/withdraw-request/`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
