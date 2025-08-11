import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toCamelCase } from '../utils/stringUtils';
import { Badge } from '@/components/ui/badge';

// Define the Transaction type with more specific fields
type Transaction = {
  transactionId: string;
  name: string;
  email: string;
  amount: string;
  paymentMethod: string;
  date: string;
  status: string;
   [key: string]: string | number | boolean;
};

type DynamicTableProps = {
  headers: string[];
  data: Transaction[];  // Use the `Transaction` type here
};

const RecentTransaction: React.FC<DynamicTableProps> = ({ headers, data }) => {
  return (
    <div className="">
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
          <CardDescription>A list of recent transactions from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-white shadow-md overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader className="bg-gray-100 sticky top-0 z-10">
                <TableRow className="py-20">
                  {headers.map((header, idx) => (
                    <TableHead key={idx}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((transaction, idx) => (
                  <TableRow
                    key={transaction.transactionId}
                    className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                  >
                    {headers.map((header, idx) => {
                      const key = toCamelCase(header);  // Ensure the key is converted to camel case
                      return (
                        <TableCell key={idx}>
                          {header === "Status" ? (
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
                          ) : (
                            transaction[key] || "N/A"
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecentTransaction
