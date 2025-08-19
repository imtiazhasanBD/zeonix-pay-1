"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2, Globe2, Phone, Shield,
  Upload, Pencil, Save, X, Copy, Check, Link as LinkIcon,
  ToggleLeft, ToggleRight, BadgeDollarSign
} from "lucide-react";

// ---------------- Types ----------------
type MerchantData = {
  brand_name: string;
  whatsapp_number: string;
  domain_name: string;       // e.g. "https://zenxone.com/"
  brand_logo: string | null; // URL or base64
  status: "Active" | "Inactive" | string;
  is_active: boolean;
  fees: string;              // store the number as string, e.g. "10.00" -> displays as "10%"
};

type ApiKeyItem = {
  id: number;
  api_key: string;
  secret_key: string;
  is_active: boolean;
  created_at: string; // ISO
  merchant: number;
};

// ---------------- Mock incoming data ----------------
const incomingMerchant: MerchantData = {
  brand_name: "Zenxone",
  whatsapp_number: "01311210855",
  domain_name: "https://zenxone.com/",
  brand_logo: null,
  status: "Active",
  is_active: true,
  fees: "10.00",
};

const incomingKey: ApiKeyItem = {
  id: 1,
  api_key: "83J9puxXSKMgvRtcWG8kpApYowtm_yvdIF4CnQtDXR8",
  secret_key:
    "pbkdf2_sha256$1000000$BN9IzXjq7JuEXVgYsdKiMT$kpV7UGLdqAnpbpTmX8SNbzEenPkxJWo5rmm0n+8xdbM=",
  is_active: true,
  created_at: "2025-08-13T15:34:52.194024+06:00",
  merchant: 1,
};

export default function MerchantProfilePage({
  data = incomingMerchant,
  keyData = incomingKey,
}: {
  data?: MerchantData;
  keyData?: ApiKeyItem;
}) {
  // Normalize domain if it came as markdown link "[url](url)"
  const normalizedDomain = useMemo(() => {
    const mdMatch = data.domain_name.match(/\((https?:\/\/[^\s)]+)\)/);
    return mdMatch?.[1] ?? data.domain_name;
  }, [data.domain_name]);

  // ---------------- Profile state ----------------
  const [editing, setEditing] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedWhats, setCopiedWhats] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(data.brand_logo);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<MerchantData>({
    brand_name: data.brand_name,
    whatsapp_number: data.whatsapp_number,
    domain_name: normalizedDomain,
    brand_logo: data.brand_logo,
    status: data.status,
    is_active: data.is_active,
    fees: data.fees, // percentage number as string
  });

  const initials = useMemo(() => {
    const n = (form.brand_name || "BIZ").trim();
    const parts = n.split(/\s+/);
    const first = parts[0]?.[0]?.toUpperCase() ?? "B";
    const second = parts[1]?.[0]?.toUpperCase() ?? "";
    return (first + second) || "B";
  }, [form.brand_name]);

  const statusPill = (s: string) =>
    s?.toLowerCase() === "active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";

  const onCopy = async (text: string, which: "domain" | "whats") => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "domain") {
        setCopiedDomain(true);
        setTimeout(() => setCopiedDomain(false), 1200);
      } else {
        setCopiedWhats(true);
        setTimeout(() => setCopiedWhats(false), 1200);
      }
    } catch { }
  };

  const onPickLogo = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewLogo(result);
      setForm((s) => ({ ...s, brand_logo: result }));
    };
    reader.readAsDataURL(f);
  };

  const onSave = async () => {
    // basic validations
    if (!form.brand_name.trim()) return alert("Brand name is required.");
    if (!/^https?:\/\//i.test(form.domain_name))
      return alert("Domain should start with http:// or https://");
    if (!/^\d{6,}$/.test(form.whatsapp_number.replace(/\D/g, "")))
      return alert("Enter a valid WhatsApp number.");
    if (!/^\d+(\.\d{1,2})?$/.test(form.fees))
      return alert("Fees should be a valid percentage number (e.g., 10 or 10.00).");

    // TODO: PATCH /api/merchant/profile with `form`
    setEditing(false);
  };

  const onCancel = () => {
    setForm({
      brand_name: data.brand_name,
      whatsapp_number: data.whatsapp_number,
      domain_name: normalizedDomain,
      brand_logo: data.brand_logo,
      status: data.status,
      is_active: data.is_active,
      fees: data.fees,
    });
    setPreviewLogo(data.brand_logo);
    setEditing(false);
  };

  // ---------------- Single API Key state ----------------
  const [apiKey, setApiKey] = useState<ApiKeyItem>(keyData);
  const [showApi, setShowApi] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const copyKey = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  };

  // Generate ONLY replaces the single key (no multiples, no delete)
  const generateKey = async () => {
    try {
      // TODO: POST /api/merchant/keys/generate to rotate the current key server-side
      const rotated: ApiKeyItem = {
        ...apiKey,
        api_key: crypto.randomUUID().replace(/-/g, ""),
        secret_key: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_active: true,
      };
      setApiKey(rotated);
    } catch (e) {
      console.error(e);
      alert("Failed to rotate key.");
    }
  };

  const toggleKeyActive = async (next: boolean) => {
    try {
      // TODO: PATCH /api/merchant/keys/:id { is_active: next }
      setApiKey((prev) => ({ ...prev, is_active: next }));
    } catch {
      alert("Failed to update key status.");
    }
  };

  return (

      <div className="mx-auto w-full space-y-6">
        {/* -------- Profile Card (with bg-customViolet header background) -------- */}
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          {/* Full-width violet header background */}
          <div className="relative bg-customViolet">
            <div className="h-24 w-full" />
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-10 flex items-end justify-between">
              {/* Brand logo / initials */}
              <div className="flex items-end gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white ring-1 ring-black/10 shadow -mt-6 overflow-hidden">
                  {previewLogo ? (
                    <Image
                      src={previewLogo}
                      alt="Brand Logo"
                      width={72}
                      height={72}
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-xl bg-violet-100 text-violet-700 text-xl font-semibold">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-semibold text-slate-900">
                    {form.brand_name || "—"}
                  </h1>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring ${statusPill(
                        form.status
                      )}`}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      {form.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({form.is_active ? "Active" : "Inactive"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={onPickLogo}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Upload className="h-4 w-4" /> Logo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={onFileChange}
                    />
                  </>
                ) : (
                  <>
                    <button
                      onClick={onCancel}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                      onClick={onSave}
                      className="inline-flex items-center gap-2 rounded-lg bg-customViolet px-3 py-2 text-sm font-semibold text-white hover:bg-customViolet/90"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1 */}
            <div className="space-y-4">
              <Field
                icon={<Building2 className="h-4 w-4 text-slate-500" />}
                label="Brand Name"
                value={form.brand_name}
                editable={editing}
                onChange={(v) => setForm((s) => ({ ...s, brand_name: v }))}
              />

              <Field
                icon={<Globe2 className="h-4 w-4 text-slate-500" />}
                label="Domain"
                value={form.domain_name}
                editable={editing}
                onChange={(v) => setForm((s) => ({ ...s, domain_name: v }))}
                action={
                  !editing && (
                    <div className="flex items-center gap-2">
                      <a
                        href={form.domain_name}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        title="Open"
                      >
                        <LinkIcon className="h-3.5 w-3.5" /> Open
                      </a>
                      <CopyBtn
                        onClick={() => onCopy(form.domain_name, "domain")}
                        copied={copiedDomain}
                        label="Copy"
                      />
                    </div>
                  )
                }
              />

              <Field
                icon={<Phone className="h-4 w-4 text-slate-500" />}
                label="WhatsApp"
                value={form.whatsapp_number}
                editable={editing}
                onChange={(v) => setForm((s) => ({ ...s, whatsapp_number: v }))}
                action={
                  !editing && (
                    <CopyBtn
                      onClick={() => onCopy(form.whatsapp_number, "whats")}
                      copied={copiedWhats}
                      label="Copy"
                    />
                  )
                }
              />
            </div>

            {/* Column 2 */}
            {/* Column 2 */}
            <div className="space-y-4">
              {/* Is Active toggle */}
              <ToggleField
                label="Is Active"
                value={form.is_active}
                editable={editing}
                onChange={(v) => setForm((s) => ({ ...s, is_active: v }))}
              />

              {/* Fees (percentage) */}
              <Field
                icon={<BadgeDollarSign className="h-4 w-4 text-slate-500" />}
                label="Fees (%)"
                value={form.fees}
                editable={editing}
                onChange={(v) => setForm((s) => ({ ...s, fees: v }))}
              />

              {/* Status (read only) */}
              <Field
                icon={<Shield className="h-4 w-4 text-slate-500" />}
                label="Status"
                value={form.status}
                editable={false}
              />
            </div>

          </div>
        </div>

        {/* -------- Single API Key Card (no delete, no multiples) -------- */}
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div className="px-6 py-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-lg">API Key</h2>
                <p className="text-sm text-muted-foreground">
                  Generate a new key, reveal/copy, and toggle active.
                </p>
              </div>
              <button
                onClick={generateKey}
                className="inline-flex items-center gap-2 rounded-lg bg-customViolet px-3 py-2 text-sm font-semibold text-white hover:bg-customViolet/90"
              >
                Rotate / Generate
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
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <span className="text-xs mr-1">Active</span>
                    <button
                      onClick={() => toggleKeyActive(!apiKey.is_active)}
                      className={[
                        "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium",
                        apiKey.is_active
                          ? "text-emerald-700 hover:bg-emerald-50"
                          : "text-slate-600 hover:bg-slate-50",
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
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RevealableField
                  label="API Key"
                  value={apiKey.api_key}
                  show={showApi}
                  onToggle={() => setShowApi((s) => !s)}
                  onCopy={() => copyKey(apiKey.api_key)}
                />
                <RevealableField
                  label="Secret Key"
                  value={apiKey.secret_key}
                  show={showSecret}
                  onToggle={() => setShowSecret((s) => !s)}
                  onCopy={() => copyKey(apiKey.secret_key)}
                />
              </div>'
              '
            </div>
          </div>
        </div>
        {/* -------- end key card -------- */}
      </div>
   
  );
}

/* ----------------------- UI helpers ----------------------- */

function Field({
  icon,
  label,
  value,
  editable = false,
  onChange,
  action,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      {editable ? (
        <div className="flex items-center gap-2">
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
          {label.toLowerCase().includes("fees") && (
            <span className="text-sm text-slate-500 mt-1">%</span>
          )}
        </div>
      ) : (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800 break-all">
            {label.toLowerCase().includes("fees")
              ? (Number(value) % 1 === 0 ? `${parseInt(value, 10)}%` : `${parseFloat(value).toFixed(2)}%`)
              : (value || "—")}
          </span>
          {action}
        </div>
      )}
    </div>
  );
}

function ToggleField({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: boolean;
  editable?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      {editable ? (
        <button
          onClick={() => onChange?.(!value)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {value ? (
            <ToggleRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-slate-400" />
          )}
          {value ? "Active" : "Inactive"}
        </button>
      ) : (
        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {value ? "Active" : "Inactive"}
        </div>
      )}
    </div>
  );
}

function RevealableField({
  label,
  value,
  show,
  onToggle,
  onCopy,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          type={show ? "text" : "password"}
          value={value}
          className="mt-0 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200"
        />
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {show ? "Hide" : "Show"}
        </button>
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

function CopyBtn({
  onClick,
  copied,
  label = "Copy",
}: {
  onClick: () => void;
  copied?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      title={label}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
