"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Support";
  status: "Active" | "Suspended";
};

const initialStaff: Staff[] = [
  { id: "s1", name: "Arif Hasan", email: "arif@example.com", role: "Admin", status: "Active" },
  { id: "s2", name: "Nusrat Jahan", email: "nusrat@example.com", role: "Manager", status: "Active" },
  { id: "s3", name: "Sohan Rahman", email: "sohan@example.com", role: "Support", status: "Suspended" },
];

export default function StaffListPage() {
  const [rows, setRows] = useState<Staff[]>(initialStaff);

  const handleEdit = (row: Staff) => {
    console.log("Edit staff", row);
    // TODO: open edit dialog / navigate to edit page
  };

  const handleDelete = (row: Staff) => {
    if (!confirm(`Delete staff "${row.name}"?`)) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Staff List</h1>
        <p className="text-sm text-muted-foreground">Team members with access to the system.</p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[30%]">Email</TableHead>
              <TableHead className="w-[20%]">Role</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      row.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(row)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
