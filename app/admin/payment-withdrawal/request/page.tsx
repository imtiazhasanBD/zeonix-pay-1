"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { Landmark, Smartphone, Coins, Settings } from "lucide-react";

type Method = "bank" | "mobileBanking" | "crypto" | null;

type SavedPaymentMethod = {
  id: string;
  method: Exclude<Method, null>;
  details: string; // masked display text
  isPrimary: boolean;
  meta?: Record<string, unknown>;
};
const STORAGE_KEY = "paymentMethods";
const MANAGE_PATH = "/payment-withdrawal/methods";

// Seed data (only if localStorage is empty)
const SEED_DATA: SavedPaymentMethod[] = [
  {
    id: "d91fe210-54b3-4e05-aec7-6b6c79c5bbdd",
    method: "mobileBanking",
    details: "nagad **** 6464",
    isPrimary: false,
    meta: {
      mobileProvider: "nagad",
      accountType: "personal",
      phoneNumber: "0178364646464",
    },
  },
  {
    id: "d89dee0c-7ead-4ad4-a295-226519155984",
    method: "bank",
    details: "4454545 **** 45tr",
    isPrimary: true,
    meta: {
      holderName: "fffdfd",
      accountNumber: "5444444445tr",
      bankName: "4454545",
      branchName: "fdfdfdfdfdf",
    },
  },
];

const methodIconMap: Record<Exclude<Method, null>, React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  mobileBanking: Smartphone,
  crypto: Coins,
};

const Page = () => {
  // optionally disable types
  const disabledMethods: Record<Exclude<Method, null>, boolean> = {
    bank: false,
    mobileBanking: false,
    crypto: false,
  };

  const methodLabel: Record<Exclude<Method, null>, string> = {
    bank: "Bank",
    mobileBanking: "Mobile Banking",
    crypto: "Crypto",
  };

  // pick type
  const [paymentMethod, setPaymentMethod] = useState<Method>("mobileBanking");

  // saved methods
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[] | null>(null);

  // pick saved + amount
  const [selectedSavedId, setSelectedSavedId] = useState<string | undefined>();
  const [amount, setAmount] = useState<string>("");

  // load/seed storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedMethods(JSON.parse(raw));
      else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        setSavedMethods(SEED_DATA);
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      setSavedMethods(SEED_DATA);
    }
  }, []);

  // guard disabled selection
  useEffect(() => {
    if (
      (paymentMethod === "bank" && disabledMethods.bank) ||
      (paymentMethod === "mobileBanking" && disabledMethods.mobileBanking) ||
      (paymentMethod === "crypto" && disabledMethods.crypto)
    ) {
      setPaymentMethod(null);
    }
  }, [paymentMethod]);

  // reset amount on type change
  useEffect(() => {
    setAmount("");
  }, [paymentMethod]);

  // eligible saved for chosen type
  const eligibleSaved = useMemo(() => {
    if (!paymentMethod || !savedMethods || disabledMethods[paymentMethod]) return [];
    return savedMethods.filter((m) => m.method === paymentMethod);
  }, [paymentMethod, savedMethods]);

  // auto-pick primary/first when type changes
  useEffect(() => {
    if (!paymentMethod) {
      setSelectedSavedId(undefined);
      return;
    }
    if (eligibleSaved.length > 0) {
      const primary = eligibleSaved.find((m) => m.isPrimary);
      setSelectedSavedId(primary?.id ?? eligibleSaved[0].id);
    } else {
      setSelectedSavedId(undefined);
    }
  }, [paymentMethod, eligibleSaved.length]);

  const selectedSaved = useMemo(
    () => eligibleSaved.find((m) => m.id === selectedSavedId),
    [eligibleSaved, selectedSavedId]
  );

  // provider icon (from /public) or fallback lucide
  const SavedIcon = ({ saved, className }: { saved?: SavedPaymentMethod; className?: string }) => {
    if (!saved) return null;

    let src = "";
    let alt = "";

    if (saved.method === "mobileBanking") {
      if (saved.meta?.mobileProvider === "bkash") { src = "/bkash.png"; alt = "Bkash"; }
      else if (saved.meta?.mobileProvider === "nagad") { src = "/nagad.jpg"; alt = "Nagad"; }
    } else if (saved.method === "crypto") {
      if (saved.meta?.cryptoMethod === "binance") { src = "/binance.png"; alt = "Binance"; }
      else if (saved.meta?.cryptoMethod === "bybit") { src = "/bybit.png"; alt = "Bybit"; }
      else if (saved.meta?.cryptoMethod === "trc20") { src = "/trc20.png"; alt = "TRC20"; }
    }

    if (src) {
      return <Image src={src} alt={alt} width={16} height={16} className={clsx("h-4 w-4", className)} />;
    }

    const Icon = methodIconMap[saved.method];
    return <Icon className={clsx("h-4 w-4 text-muted-foreground", className)} />;
  };

  // type icon
  const TypeIcon = ({ type, className }: { type: Exclude<Method, null>; className?: string }) => {
    const Icon = methodIconMap[type];
    return <Icon className={clsx("h-4 w-4 text-muted-foreground", className)} />;
  };

  const radioItem = (id: Exclude<Method, null>, label: string) => {
    const disabled =
      (id === "bank" && disabledMethods.bank) ||
      (id === "mobileBanking" && disabledMethods.mobileBanking) ||
      (id === "crypto" && disabledMethods.crypto);

    return (
      <Label
        htmlFor={id}
        className={clsx(
          "flex items-center gap-3 border rounded-md p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
          disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit"
        )}
      >
        <RadioGroupItem value={id} id={id} disabled={disabled} />
        <TypeIcon type={id} />
        {label}
      </Label>
    );
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Request Withdrawal</CardTitle>
          <CardDescription>Transfer funds from your FlowPanel account.</CardDescription>
        </div>
        <Link href={MANAGE_PATH}>
          <Button className="gap-2 bg-customViolet hover:bg-customViolet/90 cursor-pointer">
            <Settings className="h-4 w-4" />
            Manage payment methods
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Select payment type */}
        <RadioGroup
          onValueChange={(v) => setPaymentMethod((v as Method) || null)}
          value={paymentMethod || ""}
        >
          <Label className="mb-2 block">Select Payment Method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {radioItem("bank", "Bank")}
            {radioItem("mobileBanking", "Mobile Banking")}
            {radioItem("crypto", "Crypto")}
          </div>
        </RadioGroup>

        {/* Step 2: Pick a saved method (of that type) + amount */}
        {paymentMethod && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TypeIcon type={paymentMethod as Exclude<Method, null>} />
                Select Saved {methodLabel[paymentMethod as Exclude<Method, null>]}
              </Label>


                <Select
                  value={selectedSavedId}
                  onValueChange={setSelectedSavedId}
                  disabled={eligibleSaved.length === 0}
                >
                  <SelectTrigger className="">
                    <SelectValue
                      placeholder={
                        eligibleSaved.length === 0
                          ? `No saved ${methodLabel[paymentMethod as Exclude<Method, null>]} found`
                          : `Select a saved ${methodLabel[paymentMethod as Exclude<Method, null>]}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleSaved.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <span className="flex items-center gap-2">
                          <SavedIcon saved={m} />
                          <span>{m.details} {m.isPrimary ? "(Primary)" : ""}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="$0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!selectedSavedId}
              />
            </div>

            <Button
              className="w-full bg-customViolet"
              disabled={!selectedSavedId || amount === ""}
            >
              Submit Request
            </Button>

            {eligibleSaved.length === 0 && (
              <p className="text-xs text-muted-foreground">
                You don’t have any saved {methodLabel[paymentMethod as Exclude<Method, null>]} yet.
                Use the “Manage payment methods” page to add some.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;