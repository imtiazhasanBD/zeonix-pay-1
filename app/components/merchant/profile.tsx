"use client"
import React, { useMemo, useState } from "react";
import { Mail, Phone, Shield, User, Copy, Check, Hash, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  isEditable,
  onChange,
  name,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null | undefined;
  onCopy?: (text: string) => void;
  isEditable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
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
            {isEditable ? (
              <input
                name={name}
                className="text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200 w-full"
                value={String(value ?? "")}
                onChange={onChange}
              />
            ) : (
              value ?? "—"
            )}
          </div>
        </div>
      </div>
      {onCopy && !isEditable && (
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

export default function ProfilePage({ data }: { data: ProfileData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState(data);
  const route = useRouter()

  const fullName = useMemo(() => {
    const f = newData.first_name?.trim();
    const l = newData.last_name?.trim();
    if (f && l) return `${f} ${l}`;
    return f || l || newData.username || `User #${newData.id}`;
  }, [newData]);

  const initials = useMemo(() => {
    const f = newData.first_name?.trim?.()[0] ?? newData.username?.trim?.()[0] ?? "?";
    const l = newData.last_name?.trim?.()[0] ?? "";
    return (f + l).toUpperCase();
  }, [newData]);

  const statusTone =
    newData.status?.toLowerCase() === "active"
      ? "bg-green-50 text-green-700 ring-green-600/20"
      : newData.status?.toLowerCase() === "inactive"
      ? "bg-gray-50 text-gray-700 ring-gray-600/20"
      : "bg-amber-50 text-amber-700 ring-amber-600/20";

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
       // Wrap the fetch call inside toast.promise
        toast.promise(
            fetch("/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: newData }),
            }).then(async (response) => {
                if (response.ok) {
                    setIsEditing(false);
                    route.refresh(); // Trigger a refresh after updating
                    return "Profile updated successfully"; // Success message
                } else {
                    throw new Error("Failed to update profile"); // Error message
                }
            }),
            {
                loading: "Updating profile...",
                success: <b>Profile updated successfully!</b>,
                error: <b>Failed to update profile.</b>,
            }
        );
  };

  return (
    <div className="min-h-screen py-4">
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
                    <span>@{newData.username}</span>
                  </Badge>
                  <Badge className={`${statusTone}`}>{newData.status ?? "Unknown"}</Badge>
                  <Badge className="bg-gray-50 text-gray-700 ring-gray-500/20 flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Role: {newData.role}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 rounded-2xl bg-customViolet px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-customViolet/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-2">
            <FieldRow
              icon={Mail}
              label="Email"
              value={newData.email}
              onCopy={handleCopy}
              isEditable={isEditing}
              onChange={handleChange}
              name="email"
            />
            <FieldRow
              icon={Phone}
              label="Phone"
              value={newData.phone_number}
              onCopy={handleCopy}
              isEditable={isEditing}
              onChange={handleChange}
              name="phone_number"
            />
            <FieldRow
              icon={User}
              label="Username"
              value={newData.username}
              onCopy={handleCopy}
              isEditable={isEditing}
              onChange={handleChange}
              name="username"
            />
            <FieldRow
              icon={Shield}
              label="Status"
              value={newData.status}
              onCopy={handleCopy}
              isEditable={isEditing}
              onChange={handleChange}
              name="status"
            />
            <FieldRow
              icon={Hash}
              label="User ID"
              value={newData.id}
              onCopy={handleCopy}
              isEditable={false}
              name="id"
            />
            <FieldRow
              icon={Hash}
              label="PID"
              value={newData.pid}
              onCopy={handleCopy}
              isEditable={false}
              name="pid"
            />
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-customViolet hover:bg-customViolet/90 px-4 py-2 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
