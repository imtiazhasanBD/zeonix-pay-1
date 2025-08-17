"use client"
import React from 'react'
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { Landmark, Smartphone, Coins } from "lucide-react";
import { getPaymentMethodList } from "@/app/lib/api/merchant/payment-method";
import toast from 'react-hot-toast';

// ---------------- Types ----------------
type Method = "bank" | "mobileBanking" | "crypto" | null;

type SavedPaymentMethod = {
    id: string;                // string for Select value
    method: Exclude<Method, null>;
    details: string;           // masked display text
    isPrimary: boolean;
    meta?: Record<string, any>;
};

type PaymentMethod = {
    id: number;
    method_type: Method;
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


const methodIconMap: Record<Exclude<Method, null>, React.ComponentType<{ className?: string }>> = {
    bank: Landmark,
    mobileBanking: Smartphone,
    crypto: Coins,
};

const methodLabel: Record<Exclude<Method, null>, string> = {
    bank: "Bank",
    mobileBanking: "Mobile Banking",
    crypto: "Crypto",
};

// --------------- Helpers ---------------
const maskLast4 = (v?: string) => (v ? `**** ${v.slice(-4)}` : "****");

const mapApiToSaved = (m: PaymentMethod): SavedPaymentMethod => {
    const method: Exclude<Method, null> =
        m.method_type === "bank" ? "bank" :
            m.method_type === "crypto" ? "crypto" : "mobileBanking";

    const last4 = maskLast4(m.params?.account_number);
    const details =
        method === "mobileBanking" ? `${m.method_type} ${last4}` :
            method === "bank" ? `${m.params?.account_name || "Bank"} ${last4}` :
                `Crypto ${last4}`;

    return {
        id: String(m.id),
        method,
        details,
        isPrimary: m.is_primary,
        meta:
            method === "mobileBanking"
                ? { mobileProvider: m.method_type, phoneNumber: m.params?.account_number }
                : method === "bank"
                    ? { holderName: m.params?.account_name, accountNumber: m.params?.account_number }
                    : { cryptoMethod: "binance", cryptoId: m.params?.account_number }, // adjust if you store specific crypto method
    };
};

const Submit_request = ({ data }: { data: PaymentMethod[] }) => {
    // optionally disable specific types
    const disabledMethods: Record<Exclude<Method, null>, boolean> = {
        bank: true,
        mobileBanking: false,
        crypto: true,
    };
    console.log(data);

    // pick type
    const [paymentMethod, setPaymentMethod] = useState<Method>(null);

    // saved methods (from API)
    const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[] | null>(null);

    // pick saved + amount
    const [selectedSavedId, setSelectedSavedId] = useState<string | undefined>();
    const [amount, setAmount] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    // fetch payment methods from API on mount
    useEffect(() => {
        let active = true;
        try {
            if (!active) return;
            setSavedMethods(data.map(mapApiToSaved));
            console.log(data);

        } catch (e) {
            console.error(e);
            if (active) setSavedMethods([]);
        }
        return () => { active = false; };
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
    useEffect(() => { setAmount(""); }, [paymentMethod]);

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
            else if (saved.meta?.mobileProvider === "rocket") { src = "/rocket.png"; alt = "Rocket"; }
            else if (saved.meta?.mobileProvider === "upay") { src = "/upay.png"; alt = "Upay"; }
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

    // submit withdraw request via proxy
    const onSubmitWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSavedId || !amount) return;

        const payload = {
            amount: String(amount),
            payment_method: Number(selectedSavedId),
        };

        // use toast.promise
        await toast.promise(
            (async () => {
                setSubmitting(true);
                const res = await fetch("/api/merchant/withdraw-request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.message ?? "Withdraw request failed");
                }

                // success → return value used in success render
                return data?.message ?? "Withdraw request submitted!";
            })(),
            {
                loading: "Submitting request...",
                success: (msg) => <b>{msg}</b>,
                error: (err) => <b>{err.message}</b>,
            }
        ).finally(() => {
            setSubmitting(false);
            setAmount("");
        });
    };

    return (
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
                <form className="space-y-4" onSubmit={onSubmitWithdraw}>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <TypeIcon type={paymentMethod as Exclude<Method, null>} />
                            Select Saved {methodLabel[paymentMethod as Exclude<Method, null>]}
                        </Label>

                        <Select
                            value={selectedSavedId}
                            onValueChange={setSelectedSavedId}
                            disabled={!savedMethods || eligibleSaved.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        !savedMethods
                                            ? "Loading payment methods…"
                                            : eligibleSaved.length === 0
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
                                            <span>
                                                {m.details} {m.isPrimary ? "(Primary)" : ""}
                                            </span>
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
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={!selectedSavedId}
                        />
                    </div>

                    <Button
                        className="w-full bg-customViolet hover:bg-customViolet/90"
                        disabled={!selectedSavedId || amount === "" || submitting}
                        type="submit"
                    >
                        {submitting ? "Submitting..." : "Submit Request"}
                    </Button>

                    {savedMethods && eligibleSaved.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                            You don’t have any saved {methodLabel[paymentMethod as Exclude<Method, null>]} yet.
                            Use the “Manage payment methods” page to add some.
                        </p>
                    )}
                </form>
            )}
        </CardContent>
    )
}

export default Submit_request