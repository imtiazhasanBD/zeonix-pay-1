'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export type BkashAgentFlowProps = {
  merchantName: string;
  merchantInvoiceId: string;
  merchantLogoSrc?: string;
  receiverMsisdn: string;
  amount: number; // BDT
  onClose: () => void;
  onBack?: () => void;
  onVerifyTrx?: (trxId: string) => Promise<void> | void;
  paymentMethod: string; // Add the payment method prop
};

export default function BkashAgentFlow({
  merchantName,
  merchantInvoiceId,
  merchantLogoSrc = "/bkash.png",
  receiverMsisdn,
  amount,
  onClose,
  onBack,
  onVerifyTrx,
  paymentMethod, // Add paymentMethod prop here
}: BkashAgentFlowProps) {
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(receiverMsisdn);
      setCopied(true);
      toast.success("কপি হয়েছে")
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };


  // Set the button text and steps based on the payment method (personal or agent)
  const actionText = paymentMethod.includes("personal") ? "Send Money" : "Cash Out";
  const dialCode = paymentMethod.includes("bkash") ? "*247#" : paymentMethod.includes("nagad") ? "*167#" : "*322#" // Dynamic dial code
  const method = paymentMethod.includes("bkash") ? "Bkash" : paymentMethod.includes("nagad") ? "Nagad" : "rocket"

  const onVerify = async () => {
    console.log(trxId);
    
    if (!trxId.trim()) return;

    // Construct the correct API URL based on the selected payment method
    const url = `${process.env.BASE_URL}/get-payment/${method.toLowerCase()}-payment/?method=${paymentMethod.toLowerCase()}&invoice_payment_id=${merchantInvoiceId}`;

    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ transaction_Id: trxId }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from server:", data);
        toast.error(data.message)
      })
      .catch(error => {
        console.error("Error verifying transaction:", error);
      });
  };


  return (
    <div className="w-full rounded-2xl bg-white ring-1 ring-black/5">
      {/* Pink instruction card */}
      <div className="rounded-xl bg-rose-600/90 text-white">
        <div className="px-6 pt-5 pb-2 text-center">
          <div className="text-sm/5 font-semibold tracking-wide">ট্রানজেকশন আইডি দিন</div>
        </div>

        <div className="px-6 pb-4">
          <input
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="ট্রানজেকশন আইডি দিন"
            className="w-full rounded-lg bg-white/95 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none ring-2 ring-transparent focus:ring-white"
          />
        </div>

        <div className="px-6 pb-6 space-y-3 text-[13px]">
          <Step>{dialCode} ডায়াল করে আপনার {method} মোবাইল মেনুতে যান অথবা অ্যাপ চালু করুন</Step>
          <Divider />
          <Step><b className="">{`${actionText} এ ক্লিক করুন`}</b></Step>
          <Divider />
          <Step className="flex items-center gap-2 flex-wrap">
            উত্তোলক নম্বর হিসেবে এই নম্বরটি লিখুন{" "}
            <span className="font-bold bg-white/20 rounded px-2 py-0.5">{receiverMsisdn}</span>
            <button
              onClick={copyNumber}
              className="inline-flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-rose-700 font-medium hover:bg-white"
            >
              <span className="text-[12px]">Copy</span>
            </button>
          </Step>
          <Divider />
          <Step>
            টাকার পরিমাণ{" "}
            <span className="font-semibold bg-white/20 rounded px-2 py-0.5">৳{amount.toFixed(2)}</span>
          </Step>
          <Divider />
          <Step>নির্দিষ্ট ধাপে গিয়ে আপনার {paymentMethod === "personal" ? "Bkash" : "Nagad"} মোবাইল মেনু দিয়ে লেনদেন সম্পূর্ণ করুন।</Step>
          <Divider />
          <Step>সফলভাবে টাকা পাঠালে, আপনি {paymentMethod === "personal" ? "Bkash" : "Nagad"} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</Step>
          <Divider />
          <Step>
            বার্তা পাওয়ার পর আপনার <b>Transaction ID</b> দিন এবং নিচের <b>VERIFY</b> বাটনে ক্লিক করুন।
          </Step>
        </div>
      </div>

      {/* Verify button */}
      <div className="px-6 pb-6 mt-6">
        <button
          onClick={onVerify}
          disabled={!trxId.trim()}
          className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
        >
          VERIFY
        </button>
      </div>
    </div>
  );
}

function Step({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-white ${className}`}>{children}</p>;
}

function Divider() {
  return <div className="h-px w-full bg-white/20 my-2" />;
}
