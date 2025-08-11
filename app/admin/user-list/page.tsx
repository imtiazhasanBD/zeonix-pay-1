"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const initialUsers: User[] = [
  { id: "u1", name: "Imran Hossain", email: "imran@example.com", role: "Customer" },
  { id: "u2", name: "Tanzila Akter", email: "tanzila@example.com", role: "Merchant" },
  { id: "u3", name: "Rafiul Islam", email: "rafiul@example.com", role: "Customer" },
];

export default function UserListPage() {
  const [rows, setRows] = useState<User[]>(initialUsers);

  const handleEdit = (row: User) => {
    console.log("Edit user", row);
    // TODO: open edit dialog / navigate to edit page
  };

  const handleDelete = (row: User) => {
    if (!confirm(`Delete user "${row.name}"?`)) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">User List</h1>
        <p className="text-sm text-muted-foreground">All users in your system.</p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[40%]">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
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
                <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
