"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Landmark, Smartphone, Coins } from "lucide-react";
import clsx from "clsx";

// ---- API types ----
type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

type PaymentMethod = {
    id: number;
    method_type: MethodType;
    params: {
        account_name: string;
        account_number: string;
    };
    status: string;       // "active" | "inactive" | "pending" | ...
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    merchant: number;
};

type ApiResponse = {
    status: boolean;
    count: number;
    data: PaymentMethod[];
};

// ---- helpers: icons & logos ----
const methodIconMap: Record<"bank" | "mobile" | "crypto", React.ComponentType<{ className?: string }>> = {
    bank: Landmark,
    mobile: Smartphone,
    crypto: Coins,
};

function getProviderAsset(method: MethodType): { src?: string; alt?: string; fallback: "bank" | "mobile" | "crypto" } {
    const m = method.toLowerCase();
    if (m === "bkash") return { src: "/bkash.png", alt: "bKash", fallback: "mobile" };
    if (m === "nagad") return { src: "/nagad.jpg", alt: "Nagad", fallback: "mobile" };
    if (m === "rocket") return { src: "/rocket.png", alt: "Rocket", fallback: "mobile" };
    if (m === "upay") return { src: "/upay.png", alt: "Upay", fallback: "mobile" };
    if (m === "crypto") return { src: "/binance.png", alt: "Crypto", fallback: "crypto" }; // adjust if you want
    return { fallback: m === "bank" ? "bank" : "mobile" };
}

function ProviderLogo({ method, className }: { method: MethodType; className?: string }) {
    const { src, alt, fallback } = getProviderAsset(method);
    if (src) {
        return <Image src={src} alt={alt || "provider"} width={20} height={20} className={clsx("h-5 w-5", className)} />;
    }
    const Fallback = methodIconMap[fallback];
    return <Fallback className={clsx("h-5 w-5 text-muted-foreground", className)} />;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" {
    const x = s.toLowerCase();
    if (["active", "success", "completed"].includes(x)) return "default";
    if (["pending", "processing"].includes(x)) return "secondary";
    return "destructive";
}

function maskNumber(n: string) {
    if (!n) return "";
    const last4 = n.slice(-4);
    return `•••• ${last4}`;
}

// ---- Component ----
export default function PaymentMethodsList({ data }: { data: PaymentMethod[] }) {
    const [methods, setMethods] = useState<PaymentMethod[]>(data ?? []);
    console.log(methods);



    const setPrimary = (id: number) => {
        setMethods(prev => prev.map(pm => ({ ...pm, is_primary: pm.id === id })));
    };

    const removeMethod = (id: number) => {
        setMethods(prev => prev.filter(pm => pm.id !== id));

    };

    return (

        <div className="space-y-4 p-6">
            {methods.length === 0 && (
                <div className="border rounded-md p-4 text-sm text-muted-foreground">
                    No payment methods yet.
                </div>
            )}

            {methods.map((m) => (
                <div key={m.id} className="border rounded-md p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ProviderLogo method={m.method_type} />
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                {m.method_type.charAt(0).toUpperCase() + m.method_type.slice(1)}
                                {m.is_primary && <Badge variant="outline">Primary</Badge>}
                                <Badge  className={`capitalize ${m.status === "active"? "bg-green-600": "bg-gray-400"}`} >{m.status}</Badge>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {m.params.account_name} • {maskNumber(m.params.account_number)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!m.is_primary && (
                            <Button variant="ghost" size="sm" onClick={() => setPrimary(m.id)}>
                                Set Primary
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => removeMethod(m.id)}>
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
        </div>

    );
}
