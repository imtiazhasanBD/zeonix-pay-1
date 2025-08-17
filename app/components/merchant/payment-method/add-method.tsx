"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Landmark, Smartphone, Coins } from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";
import clsx from "clsx";
import PaymentMethodsList from "./list";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Method = "bank" | "mobileBanking" | "crypto";

type BankMeta = {
  holderName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
};

type MobileBankingMeta = {
  mobileProvider?: string;
  accountType: string;
  phoneNumber: string;
};

type CryptoMeta = {
  cryptoMethod?: string;
  cryptoId: string;
};

type PaymentMethodItem = {
  id: string;
  method: Method;
  details: string;
  isPrimary: boolean;
  meta?: BankMeta | MobileBankingMeta | CryptoMeta;
};

// ---- API types ----
type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

type PaymentMethod = {
  id: number;
  method_type: MethodType;
  params: {
    account_name: string;
    account_number: string;
  };
  status: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  merchant: number;
}

const STORAGE_KEY = "paymentMethods";

// ----------  for logos/icons ----------
const methodIconMap: Record<Method, React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  mobileBanking: Smartphone,
  crypto: Coins,
};

function getProviderAsset(
  method: Method,
  meta?: BankMeta | MobileBankingMeta | CryptoMeta
): { src?: string; alt?: string } {
  if (method === "mobileBanking") {
    const p = (meta as MobileBankingMeta)?.mobileProvider?.toLowerCase();
    if (p === "bkash") return { src: "/bkash.png", alt: "Bkash" };
    if (p === "nagad") return { src: "/nagad.jpg", alt: "Nagad" };
  }
  if (method === "crypto") {
    const c = (meta as CryptoMeta)?.cryptoMethod?.toLowerCase();
    if (c === "binance") return { src: "/binance.png", alt: "Binance" };
    if (c === "bybit") return { src: "/bybit.png", alt: "Bybit" };
    if (c === "trc20") return { src: "/trc20.png", alt: "TRC20" };
  }
  return {};
}

function ProviderLogo({
  method,
  meta,
  className,
}: {
  method: Method;
  meta?: BankMeta | MobileBankingMeta | CryptoMeta;
  className?: string;
}) {
  const { src, alt } = getProviderAsset(method, meta);
  if (src) {
    return (
      <Image
        src={src}
        alt={alt || "provider"}
        width={20}
        height={20}
        className={clsx("h-5 w-5", className)}
      />
    );
  }
  const Fallback = methodIconMap[method];
  return <Fallback className={clsx("h-5 w-5 text-muted-foreground", className)} />;
}

const AddMethod = ({ data }: { data: PaymentMethod[] }) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<Method>("bank");
  const [makePrimary, setMakePrimary] = useState<boolean>(false);
  // Bank
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  // Mobile banking
  const [mobileProvider, setMobileProvider] = useState<string | undefined>();
  const [accountType, setAccountType] = useState<string>("personal");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Crypto
  const [cryptoMethod, setCryptoMethod] = useState<string | undefined>();
  const [cryptoId, setCryptoId] = useState("");

  const router = useRouter();



  useEffect(() => {
    setMakePrimary(false);
    setHolderName("");
    setAccountNumber("");
    setBankName("");
    setBranchName("");
    setMobileProvider(undefined);
    setAccountType("personal");
    setPhoneNumber("");
    setCryptoMethod(undefined);
    setCryptoId("");
  }, [method]);


  const detailsPreview = useMemo(() => {
    if (method === "bank") {
      const last4 = accountNumber.slice(-4);
      return bankName
        ? `${bankName} **** ${last4 || "••••"}`
        : `Bank **** ${last4 || "••••"}`;
    }
    if (method === "mobileBanking") {
      const last4 = phoneNumber.slice(-4);
      const label = mobileProvider?.charAt(0).toUpperCase() + (mobileProvider?.slice(1) || "");
      return `${label || "Mobile"} **** ${last4 || "••••"}`;
    }
    const last4 = cryptoId.slice(-4);
    if (cryptoMethod === "trc20") return `TRC20 **** ${last4 || "••••"}`;
    if (cryptoMethod === "binance") return `Binance Pay ID **** ${last4 || "••••"}`;
    if (cryptoMethod === "bybit") return `Bybit Pay ID **** ${last4 || "••••"}`;
    return "Crypto";
  }, [method, bankName, accountNumber, mobileProvider, phoneNumber, cryptoMethod, cryptoId]);


  // create payment method...
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // map UI -> API payload
    const method_type =
      method === "bank"
        ? "bank"
        : method === "mobileBanking"
          ? (mobileProvider as "bkash" | "nagad" | "rocket" | "upay")
          : "crypto";

    const params = {
      account_name:
        method === "bank"
          ? holderName
          : method === "mobileBanking"
            ? holderName || accountType
            : holderName || "Crypto",
      account_number:
        method === "bank"
          ? accountNumber
          : method === "mobileBanking"
            ? phoneNumber
            : cryptoId,
    };

    await toast.promise(
      (async () => {
        const res = await fetch("/api/merchant/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method_type, params, status: "active" }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message ?? "Could not create method.");
        }

        return data?.message ?? "Method created!";
      })(),
      {
        loading: "Creating method...",
        success: (msg) => <b>{msg}</b>,
        error: (err) => <b>{err.message}</b>,
      }
    );

    router.refresh();
    setOpen(false);
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MdOutlinePayment size={30} className="text-muted-foreground" />
          <div>
            <CardTitle className="font-headline">Payment Methods</CardTitle>
            <CardDescription>Manage your connected bank accounts and cards.</CardDescription>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-customViolet hover:bg-customViolet/90 cursor-pointer">Add Method</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Save a method for faster withdrawals.</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Method picker */}
              <div className="space-y-2">
                <Label className="block">Method</Label>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as Method)}
                  className="grid grid-cols-3 gap-3"
                >
                  <Label
                    htmlFor="bank"
                    className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <RadioGroupItem id="bank" value="bank" />
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    Bank
                  </Label>
                  <Label
                    htmlFor="mobileBanking"
                    className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <RadioGroupItem id="mobileBanking" value="mobileBanking" />
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Mobile Banking
                  </Label>
                  <Label
                    htmlFor="crypto"
                    className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <RadioGroupItem id="crypto" value="crypto" />
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    Crypto
                  </Label>
                </RadioGroup>
              </div>

              {/* Bank form */}
              {method === "bank" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="holderName">Account Holder Name</Label>
                      <Input
                        id="holderName"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="branchName">Branch Name</Label>
                      <Input
                        id="branchName"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile banking form */}
              {method === "mobileBanking" && (
                <div className="space-y-3">
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={mobileProvider} onValueChange={setMobileProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bkash">
                          <span className="flex items-center gap-2">
                            <Image src="/bkash.png" alt="Bkash" width={16} height={16} />
                            Bkash
                          </span>
                        </SelectItem>
                        <SelectItem value="nagad">
                          <span className="flex items-center gap-2">
                            <Image src="/nagad.jpg" alt="Nagad" width={16} height={16} />
                            Nagad
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Account Type</Label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g., 01700000000"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Crypto form */}
              {method === "crypto" && (
                <div className="space-y-3">
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={cryptoMethod} onValueChange={setCryptoMethod}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Select Payment Method type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="binance">
                          <span className="flex items-center gap-2">
                            <Image src="/binance.png" alt="Binance" width={16} height={16} />
                            Binance
                          </span>
                        </SelectItem>
                        <SelectItem value="bybit">
                          <span className="flex items-center gap-2">
                            <Image src="/bybit.png" alt="Bybit" width={16} height={16} />
                            Bybit
                          </span>
                        </SelectItem>
                        <SelectItem value="trc20">
                          <span className="flex items-center gap-2">
                            <Image src="/trc20.png" alt="TRC20" width={16} height={16} />
                            TRC20
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cryptoId">
                      {cryptoMethod === "trc20" ? "TRC20 ID" : "Pay ID"}
                    </Label>
                    <Input
                      id="cryptoId"
                      value={cryptoId}
                      onChange={(e) => setCryptoId(e.target.value)}
                      placeholder={
                        cryptoMethod === "trc20"
                          ? "e.g., Txxxxxxxxxxxxxxxxxxxx"
                          : "e.g., 123456789 / user@example.com"
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {/* Primary & Preview */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={makePrimary}
                    onCheckedChange={setMakePrimary}
                    id="makePrimary"
                  />
                  <Label htmlFor="makePrimary">Make Primary</Label>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ProviderLogo
                    method={method}
                    meta={
                      method === "bank"
                        ? { holderName, accountNumber, bankName, branchName }
                        : method === "mobileBanking"
                          ? { mobileProvider, accountType, phoneNumber }
                          : { cryptoMethod, cryptoId }
                    }
                  />
                  <span>
                    Preview: <span className="font-medium">{detailsPreview}</span>
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-customViolet">
                  Save Method
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <PaymentMethodsList data={data} />
    </Card>
  );
};

export default AddMethod;