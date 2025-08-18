"use client"

import React, { useMemo, useState } from "react";
import { Mail, Phone, Shield, User, Copy, Check, Hash, Edit3 } from "lucide-react";

// Demo data from the prompt. In a real app, pass this as props or fetch from your API.
const demoData = {
  id: 3,
  username: "demo",
  first_name: "demo",
  last_name: "demo",
  email: "demo@gmail.com",
  phone_number: "01775155760",
  status: "Active",
  role: 3,
  pid: "be8e3258-0f53-4576-a006-bc48d2311d2a",
};

export type ProfileData = typeof demoData;

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null | undefined;
  onCopy?: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    if (!onCopy || value == null) return;
    await navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
          <div className="truncate text-base font-medium text-gray-900" title={String(value ?? "—")}>
            {value ?? "—"}
          </div>
        </div>
      </div>
      {onCopy && (
        <button
          onClick={doCopy}
          className="inline-flex h-9 items-center gap-2 rounded-xl px-3 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
    </div>
  );
}

export default function ProfilePage({ data = demoData }: { data?: ProfileData }) {
  const fullName = useMemo(() => {
    const f = data.first_name?.trim();
    const l = data.last_name?.trim();
    if (f && l) return `${f} ${l}`;
    return f || l || data.username || `User #${data.id}`;
  }, [data]);

  const initials = useMemo(() => {
    const f = data.first_name?.trim?.()[0] ?? data.username?.trim?.()[0] ?? "?";
    const l = data.last_name?.trim?.()[0] ?? "";
    return (f + l).toUpperCase();
  }, [data]);

  const statusTone = data.status?.toLowerCase() === "active"
    ? "bg-green-50 text-green-700 ring-green-600/20"
    : data.status?.toLowerCase() === "inactive"
      ? "bg-gray-50 text-gray-700 ring-gray-600/20"
      : "bg-amber-50 text-amber-700 ring-amber-600/20";

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen  py-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-lg font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-300">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{fullName}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-600/20 flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>@{data.username}</span>
                  </Badge>
                  <Badge className={`${statusTone}`}>{data.status ?? "Unknown"}</Badge>
                  <Badge className="bg-gray-50 text-gray-700 ring-gray-500/20 flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Role: {data.role}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-customViolet px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-customViolet/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
              onClick={() => alert("Hook up your edit flow here ✨")}
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-2">
            <FieldRow icon={Mail} label="Email" value={data.email} onCopy={handleCopy} />
            <FieldRow icon={Phone} label="Phone" value={data.phone_number} onCopy={handleCopy} />
            <FieldRow icon={Hash} label="User ID" value={data.id} onCopy={handleCopy} />
            <FieldRow icon={Hash} label="PID" value={data.pid} onCopy={handleCopy} />
          </div>

        </div>
      </div>
    </div>
  );
}
