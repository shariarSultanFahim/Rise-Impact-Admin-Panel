"use client";

import { useState } from "react";

import { Download, Eye, Pencil, Search, Trash2 } from "lucide-react";

import type { UserManagementData } from "@/types/user-management";

import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import UserDialogs from "./UserDialogs";

interface UserManagementProps {
  data: UserManagementData;
}

interface EditingUser {
  id: string;
  name: string;
  role: string;
  status: string;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "active") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (normalized === "inactive") {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-muted text-muted-foreground";
}

export default function UserManagement({ data }: UserManagementProps) {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState<string>("");
  const [editedStatus, setEditedStatus] = useState<string>("");

  const handleEditOpen = (userId: string) => {
    const user = data.users.find((u) => u.id === userId);
    if (user) {
      setEditingUser({
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status
      });
      setEditedRole(user.role);
      setEditedStatus(user.status);
    }
  };

  const handleEditSave = () => {
    if (editingUser) {
      toast({
        title: "Success",
        description: `${editingUser.name} has been updated successfully. Role: ${editedRole}, Status: ${editedStatus}`,
        variant: "default"
      });
      setEditingUser(null);
    }
  };

  const handleDeleteConfirm = () => {
    const user = data.users.find((u) => u.id === deleteUserId);
    if (user) {
      toast({
        title: "Success",
        description: `User ${user.name} has been deleted successfully.`,
        variant: "default"
      });
    }
    setDeleteUserId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{data.heading.title}</h1>
        <p className="text-sm text-muted-foreground">{data.heading.subtitle}</p>
      </header>

      <Card className="m-0 border-none bg-white p-0 shadow-none">
        <CardContent className="space-y-5 p-0">
          <Card className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="bg-white pl-9"
                aria-label="Search users"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={data.filters.status[0]} />
                </SelectTrigger>
                <SelectContent>
                  {data.filters.status.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="default" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((stat) => (
              <Card key={stat.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="bg-muted" size="sm">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name.split(" ")[0]}`}
                              alt={user.name}
                            />
                            <AvatarFallback className="text-xs font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.courses}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2 text-muted-foreground">
                          <Button variant="ghost" size="icon-sm" aria-label="View user">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Edit user"
                            onClick={() => handleEditOpen(user.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Delete user"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {data.pagination.showing} of {data.pagination.total} users
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  {Array.from({ length: data.pagination.totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isActive = page === data.pagination.page;
                    return (
                      <Button
                        key={`page-${page}`}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={isActive ? "bg-primary text-primary-foreground" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <UserDialogs
        editingUser={editingUser}
        onEditClose={() => setEditingUser(null)}
        editedRole={editedRole}
        onRoleChange={setEditedRole}
        editedStatus={editedStatus}
        onStatusChange={setEditedStatus}
        onEditSave={handleEditSave}
        deleteUserId={deleteUserId}
        onDeleteClose={() => setDeleteUserId(null)}
        onDeleteConfirm={handleDeleteConfirm}
        roles={data.filters.roles}
        statuses={data.filters.status}
      />
    </div>
  );
}
