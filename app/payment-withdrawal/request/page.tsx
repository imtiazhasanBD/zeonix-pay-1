"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const renderFormFields = () => {
    if (!paymentMethod) return null;

    if (paymentMethod === "bank") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holderName">Account Holder Name</Label>
            <Input id="holderName" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input id="accountNumber" placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" placeholder="e.g., Global Bank" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input id="branchName" placeholder="e.g., Downtown Branch" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="$0.00" />
          </div>
          <Button className="w-full">Submit Request</Button>
        </div>
      );
    }

    if (paymentMethod === "mobileBanking" ) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select Payment Method`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bkash">Bkash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
              </SelectContent>
            </Select>
            <Label>Account Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select Account Type`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" placeholder="e.g., 01700000000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="$0.00" />
          </div>
          <Button className="w-full">Submit Request</Button>
        </div>
      );
    }
    if (paymentMethod === "crypto" ) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Paymnet Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select Payment Method type`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="byBit">Bybit</SelectItem>
                <SelectItem value="trc20">Trc20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payId">Pay ID</Label>
            <Input id="payId" placeholder="e.g., 01700000000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="$0.00" />
          </div>
          <Button className="w-full">Submit Request</Button>
        </div>
      );
    }

    return null;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Request Withdrawal</CardTitle>
        <CardDescription>
          Transfer funds from your FlowPanel account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          onValueChange={setPaymentMethod}
          value={paymentMethod || ""}
        >
          <Label className="mb-2 block">Select Payment Method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Label
              htmlFor="bank"
              className="flex items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <RadioGroupItem value="bank" id="bank" />
              Bank
            </Label>
            <Label
              htmlFor="bkash"
              className="flex items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <RadioGroupItem value="mobileBanking" id="mobileBanking" />
              Moblie Banking
            </Label>
            <Label
              htmlFor="nagad"
              className="flex items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <RadioGroupItem value="crypto" id="crypto" />
              Crypto
            </Label>
          </div>
        </RadioGroup>

        {renderFormFields()}
      </CardContent>
    </Card>
  );
};

export default Page;
