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
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  HandCoins,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { StatCard } from "./components/StatCard";


const transactions = [
  {
    name: "Liam Johnson",
    email: "liam@example.com",
    transactionId: "TXN12345",
    amount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2023-06-23",
    status: "Paid",
  },
  {
    name: "Olivia Smith",
    email: "olivia@example.com",
    transactionId: "TXN12346",
    amount: "$150.00",
    paymentMethod: "PayPal",
    date: "2023-06-24",
    status: "Paid",
  },
  {
    name: "Noah Williams",
    email: "noah@example.com",
    transactionId: "TXN12347",
    amount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2023-06-25",
    status: "Pending",
  },
  {
    name: "Emma Brown",
    email: "emma@example.com",
    transactionId: "TXN12348",
    amount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2023-06-26",
    status: "Paid",
  },
  {
    name: "James Jones",
    email: "james@example.com",
    transactionId: "TXN12349",
    amount: "$550.00",
    paymentMethod: "Stripe",
    date: "2023-06-27",
    status: "Failed",
  },
];

export default function Home() {
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
      <div className="">
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
                  <TableRow className="py-20">
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                    <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, idx) => (
                    <TableRow
                      key={transaction.transactionId}
                      className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                    >
                      <TableCell>
                        <div className="font-medium py-2">{transaction.name}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {transaction.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.transactionId}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.status === "Paid"
                              ? "bg-green-600 text-white"
                              : transaction.status === "Pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-600 text-white"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
