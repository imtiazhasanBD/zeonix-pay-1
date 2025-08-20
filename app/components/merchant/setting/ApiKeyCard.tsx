"use client";
import { useState } from "react";
import { ToggleLeft, ToggleRight, Copy, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ApiKeyItem = {
  id: number;
  api_key: string;
  secret_key: string;
  is_active: boolean;
  created_at: string; // ISO
  merchant: number;
};

export default function ApiKeyCard({
  apiKey,
}: {
  apiKey: ApiKeyItem;
}) {
  const router = useRouter();
  const [showApiKey, setShowApiKey] = useState(false); // State to toggle visibility of API Key
  const [showSecretKey, setShowSecretKey] = useState(false); // State to toggle visibility of Secret Key

  const handleGenerateKey = async () => {
    toast.promise(
      fetch("/api/merchant/apikey/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ merchant_id: apiKey.merchant }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to generate API key.");
        }
        const result = await response.json();
        router.refresh();
        return result;
      }),
      {
        loading: "Generating API Key...",
        success: <b>API Key successfully generated!</b>,
        error: <b>Failed to generate API Key.</b>,
      }
    );
  };

  const handleToggleActive = async (isActive: boolean) => {
    toast.promise(
      fetch("/api/merchant/apikey/generate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: isActive,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to update API key status.");
        }
        const result = await response.json();
        router.refresh();
        return result;
      }),
      {
        loading: "Updating API Key status...",
        success: <b>API Key status updated successfully!</b>,
        error: <b>Failed to update API Key status.</b>,
      }
    );
  };

  const copyKey = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg font-semibold">API Key</h2>
            <p className="text-sm text-muted-foreground">
              Generate a new key, reveal/copy, and toggle active.
            </p>
          </div>
          <button
            onClick={handleGenerateKey}
            className="inline-flex items-center gap-2 rounded-lg bg-customViolet px-3 py-2 text-sm font-semibold text-white hover:bg-customViolet/90"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="rounded-md border p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="space-y-0.5">
              <p className="font-medium">Key #{apiKey.id}</p>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(apiKey.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleActive(!apiKey.is_active)}
                className={[
                  "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium",
                  apiKey.is_active ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {apiKey.is_active ? (
                  <ToggleRight className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-slate-400" />
                )}
                {apiKey.is_active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RevealableField
              label="API Key"
              value={apiKey.api_key}
              onCopy={() => copyKey(apiKey.api_key)}
              show={showApiKey}
              toggleShow={() => setShowApiKey(!showApiKey)} // Toggle visibility for API Key
            />
            <RevealableField
              label="Secret Key"
              value={apiKey.secret_key}
              onCopy={() => copyKey(apiKey.secret_key)}
              show={showSecretKey}
              toggleShow={() => setShowSecretKey(!showSecretKey)} // Toggle visibility for Secret Key
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RevealableField({
  label,
  value,
  onCopy,
  show,
  toggleShow,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  show: boolean;
  toggleShow: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
        <button
          onClick={toggleShow}  // Toggle visibility on button click
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          type={show ? "text" : "password"} // Toggle between 'text' and 'password' for visibility
          value={value}
          className="mt-0 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200"
        />
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
      </div>
    </div>
  );
}
