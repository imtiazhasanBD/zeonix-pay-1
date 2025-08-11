import {
    DollarSign,
    HandCoins,
    Wallet,
    PiggyBank,
} from "lucide-react";
import { StatCard } from "@/app/components/StatCard";
import RecentTransaction from "@/app/components/RecentTransaction";




const tableHeaders = ["Name", "Email", "Transaction ID", "Payment Method", "Date", "Status", "Amount"];

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
        amount: "$5500.00",
        paymentMethod: "Stripe",
        date: "2023-06-27",
        status: "Failed",
    },
];

const cardData = {
    completedWithdrawals: "$50,000",
    pendingWithdrawals: "$35,000",
    failedWithdrawals: "$5,000",
    totalSaving: "$500,000",

}

export default function page() {
    return (
        <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Completed Withdrawals"
                    amount={cardData.completedWithdrawals}
                    subtitle="Last month $4,000.00"
                    change="95%"
                    positive={true}
                    icon={<Wallet className="w-5 h-5" />}
                    bgColor="bg-cyan-100"
                    iconBg="bg-cyan-500"
                    iconColor="text-white"
                />

                <StatCard
                    title="Pending Withdrawals"
                    amount={cardData.pendingWithdrawals}
                    subtitle="Last month $1,000.00"
                    change="95%"
                    positive={true}
                    icon={<HandCoins className="w-5 h-5" />}
                    bgColor="bg-orange-100"
                    iconBg="bg-orange-500"
                    iconColor="text-white"
                />

                <StatCard
                    title="Failed Withdrawals"
                    amount={cardData.failedWithdrawals}
                    subtitle="Last month $45,000.00"
                    change="70%"
                    positive={false}
                    icon={<DollarSign className="w-5 h-5" />}
                    bgColor="bg-purple-100"
                    iconBg="bg-purple-500"
                    iconColor="text-white"
                />

                <StatCard
                    title="Total Saving"
                    amount={cardData.totalSaving}
                    subtitle="Last month $28,00.00"
                    change="95%"
                    positive={true}
                    icon={<PiggyBank className="w-5 h-5" />}
                    bgColor="bg-green-100"
                    iconBg="bg-green-500"
                    iconColor="text-white"
                />
            </div>
            <RecentTransaction headers={tableHeaders} data={transactions} />
        </div>
    );
}
