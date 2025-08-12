'use client';

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { MdPassword } from "react-icons/md";
import { CgPassword } from "react-icons/cg";
import { TbPasswordUser } from "react-icons/tb";



type User = {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone: string;
  balance: string;
  depositFee: string;
  payoutFee: string;
  status: "active" | "inactive";
  role: string;
};

const initialUsers: User[] = [
  { id: "u1", storeId: "STR-001",  name: "Imran Hossain", email: "imran@example.com", phone: "01700000000", balance: "$500", depositFee: "5", payoutFee: "3", status: "active", role: "Customer" },
  { id: "u2", storeId: "STR-001",  name: "Tanzila Akter", email: "tanzila@example.com", phone: "01700000001", balance: "$1000", depositFee: "5", payoutFee: "3", status: "inactive", role: "Merchant" },
  { id: "u3", storeId: "STR-001",  name: "Rafiul Islam", email: "rafiul@example.com", phone: "01700000002", balance: "$1500", depositFee: "5", payoutFee: "3", status: "active", role: "Customer" },
];

export default function UserListPage() {
  const [rows, setRows] = useState<User[]>(initialUsers);

  // search & filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // dialogs state
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // selected row for actions
  const [selected, setSelected] = useState<User | null>(null);

  // edit form state
  const [form, setForm] = useState<Omit<User, "id">>({
    storeId: "",
    name: "",
    email: "",
    phone: "",
    balance: "",
    depositFee: "",
    payoutFee: "",
    status: "active",
    role: "",
  });

  // reset password state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // compute filtered list from `rows` (fixes earlier filteredRows mismatch)
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.phone.includes(term);
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // page slice
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  // ensure current page stays valid when filters change
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // handlers
  const openEdit = (row: User) => {
    setSelected(row);
    setForm({
      storeId: row.storeId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      balance: row.balance,
      depositFee: row.depositFee,
      payoutFee: row.payoutFee,
      status: row.status,
      role: row.role,
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!selected) return;
    setRows((prev) =>
      prev.map((u) => (u.id === selected.id ? { ...u, ...form } : u))
    );
    setEditOpen(false);
  };

  const openReset = (row: User) => {
    setSelected(row);
    setPassword("");
    setShowPassword(false);
    setResetOpen(true);
  };

  const confirmReset = () => {
    // TODO: replace with API call
    console.log("Reset password for", selected, "to:", password);
    setResetOpen(false);
  };

  const openToggleConfirm = (row: User) => {
    setSelected(row);
    setConfirmToggleOpen(true);
  };

  const doToggle = () => {
    if (!selected) return;
    setRows((prev) =>
      prev.map((u) =>
        u.id === selected.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    setConfirmToggleOpen(false);
  };

  const openDeleteConfirm = (row: User) => {
    setSelected(row);
    setConfirmDeleteOpen(true);
  };

  const doDelete = () => {
    if (!selected) return;
    setRows((prev) => prev.filter((u) => u.id !== selected.id));
    setConfirmDeleteOpen(false);
  };

  return (
    <Card className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Staff List</h1>
        <p className="text-sm text-muted-foreground">All staff in your system.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by storeID, name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-1/3"
          aria-label="Search users"
        />

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "active" | "inactive" | "all")}
          >
            <SelectTrigger className="w-[160px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-sm border bg-white overflow-hidden">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="hover:bg-customViolet bg-customViolet text-white">
              <TableHead className="w-[15%] text-white">StoreID</TableHead>
              <TableHead className="w-[20%] text-white">Name</TableHead>
              <TableHead className="w-[20%] text-white">Email</TableHead>
              <TableHead className="w-[15%] text-white">Phone</TableHead>
              <TableHead className="w-[10%] text-white">Balance</TableHead>
              <TableHead className="w-[10%] text-white">Deposit (%)</TableHead>
              <TableHead className="w-[10%] text-white">Payout (%)</TableHead>
              <TableHead className="w-[10%] text-white">Status</TableHead>
              <TableHead className="w-[15%] text-white text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>{row.storeId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.balance}</TableCell>
                <TableCell className="text-center">{row.depositFee}</TableCell>
                <TableCell className="text-center">{row.payoutFee}</TableCell>
                <TableCell>
                  <Badge className={row.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      onClick={() => openEdit(row)}
                      aria-label="Edit"
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Reset Password */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Reset Password"
                      onClick={() => openReset(row)}
                      aria-label="Reset Password"
                      className="cursor-pointer"
                    >
                      <TbPasswordUser size={20} />
                    </Button>

                    {/* Toggle Status (Confirm) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title={row.status === "active" ? "Deactivate" : "Activate"}
                      onClick={() => openToggleConfirm(row)}
                      aria-label="Toggle Status"
                      className="cursor-pointer"
                    >
                      <RefreshCcw className={`h-4 w-4 ${row.status === "active" ? "text-orange-400" : "text-green-400"}`} />
                    </Button>

                    {/* Delete (Confirm) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => openDeleteConfirm(row)}
                      aria-label="Delete"
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <span>Page {currentPage}</span>
          <span>/</span>
          <span>{totalPages}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>

      {/* === Edit User Dialog === */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Modify user information, then click Save.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="balance">Balance</Label>
              <Input id="balance" value={form.balance} onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
            </div>
            <div className="flex gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="depositFee">Deposit (%)</Label>
                <Input id="depositFee" value={form.depositFee} onChange={(e) => setForm((f) => ({ ...f, depositFee: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="payoutFee">Payout (%)</Label>
                <Input id="payoutFee" value={form.payoutFee} onChange={(e) => setForm((f) => ({ ...f, payoutFee: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/*           <div className="grid gap-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Merchant">Merchant</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <Button onClick={saveEdit} className="bg-customViolet hover:bg-customViolet/90 cursor-pointer">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Reset Password Dialog === */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selected?.name ?? "user"}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={confirmReset}
              disabled={password.trim().length < 6}
              title={password.trim().length < 6 ? "Password must be at least 6 characters" : "Confirm reset"}
              className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Toggle Status Confirm === */}
      <AlertDialog open={confirmToggleOpen} onOpenChange={setConfirmToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selected?.status === "active" ? "Deactivate user?" : "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selected
                ? `Are you sure you want to ${selected.status === "active" ? "deactivate" : "activate"} “${selected.name}”?`
                : "Are you sure?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doToggle} className="bg-customViolet hover:bg-customViolet/90">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === Delete Confirm === */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected
                ? `This will permanently remove “${selected.name}”. You can’t undo this action.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={doDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
