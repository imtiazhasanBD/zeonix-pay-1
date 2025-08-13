import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, HandCoins, Wallet, PiggyBank } from "lucide-react";
import { StatCard } from "@/app/components/StatCard";
import { getWalletTransactions } from "@/app/lib/wallet";

// ---- Helpers ----
type ApiTransaction = {
  id: number;
  object_id: number;
  amount: string;            // "50.00"
  method: string;            // "bkash"
  status: "success" | "pending" | "failed" | string;
  created_at: string;        // ISO e.g. "2025-08-13T10:24:05.866102Z"
  trx_id: string;            // "CHD10N90H7"
  trx_uuid: string;
  tran_type: "credit" | "debit" | string;
  wallet: number;
  merchant: number;
  content_type: number;
};

const TZ = "Asia/Dhaka";
const CURRENCY = "USD"; // change to "BDT" if you prefer Taka

function formatAmount(raw: string | number) {
  const n = typeof raw === "string" ? parseFloat(raw) : raw;
  if (Number.isNaN(n)) return String(raw ?? "");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return Number(n).toFixed(2);
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}


// Define the expected API response type
type WalletTransactionsResponse = {
  status: boolean;
  count: number;
  data: [];
};


function statusClasses(status: string) {
  const s = status.toLowerCase();
  if (s === "success" || s === "paid") return "bg-green-600 text-white";
  if (s === "pending" || s === "processing") return "bg-yellow-500 text-white";
  return "bg-red-600 text-white"; // failed/others
}

export default async function page() {
  const resp = await getWalletTransactions() as WalletTransactionsResponse;
  const rows: ApiTransaction[] = Array.isArray(resp?.data) ? resp.data : [];
console.log(resp);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Completed Withdrawals"
          amount="$50,000"
          subtitle="Last month $24,000.00"
          change="95%"
          positive={true}
          icon={<Wallet className="w-5 h-5" />}
          bgColor="bg-cyan-100"
          iconBg="bg-cyan-500"
          iconColor="text-white"
        />
        <StatCard
          title="Pending Withdrawals"
          amount="$35,000"
          subtitle="Last month $1,600.00"
          change="95%"
          positive={true}
          icon={<HandCoins className="w-5 h-5" />}
          bgColor="bg-orange-100"
          iconBg="bg-orange-500"
          iconColor="text-white"
        />
        <StatCard
          title="Failed Withdrawals"
          amount="$50,000"
          subtitle="Last month $24,000.00"
          change="70%"
          positive={false}
          icon={<DollarSign className="w-5 h-5" />}
          bgColor="bg-purple-100"
          iconBg="bg-purple-500"
          iconColor="text-white"
        />
        <StatCard
          title="Total Saving"
          amount="$50,000"
          subtitle="Last month $2,500.00"
          change="95%"
          positive={true}
          icon={<PiggyBank className="w-5 h-5" />}
          bgColor="bg-green-100"
          iconBg="bg-green-500"
          iconColor="text-white"
        />
      </div>

      <div>
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>
              A list of recent transactions from your store.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border bg-white shadow-md overflow-x-auto">
              <Table className="min-w-full text-sm">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="hidden md:table-cell">ID</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Method</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((t, idx) => (
                      <TableRow
                        key={`${t.trx_uuid}-${idx}`}
                        className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                      >
                        <TableCell className="hidden md:table-cell">{t.id}</TableCell>
                        <TableCell className="font-medium">{t.trx_id}</TableCell>
                        <TableCell className="hidden sm:table-cell capitalize">{t.method}</TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{t.tran_type}</TableCell>
                        <TableCell className="hidden sm:table-cell">{formatDate(t.created_at)}</TableCell>
                        <TableCell>
                          <Badge className={statusClasses(t.status)}>
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatAmount(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
