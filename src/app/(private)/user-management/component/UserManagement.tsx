"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ChevronDown, Download, Eye, Filter, Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import type {
  UserManageQueryParams,
  UserManageResponse,
  UserManageStatus
} from "@/types/users-manage";

import { useBlockUser } from "@/lib/api/user/block-user";
import { useUnblockUser } from "@/lib/api/user/unblock-user";
import { formatDate } from "@/lib/date";

import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const STATUS_OPTIONS: Array<{ label: string; value: UserManageStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Restricted", value: "RESTRICTED" }
];

interface UserManagementProps {
  data: UserManageResponse;
  params: UserManageQueryParams;
  onParamsChange: (params: UserManageQueryParams) => void;
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
  if (normalized === "restricted") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
}

export default function UserManagement({ data, params, onParamsChange }: UserManagementProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(params.searchTerm ?? "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const { mutateAsync: blockUser, isPending: isBlockingUser } = useBlockUser();
  const { mutateAsync: unblockUser, isPending: isUnblockingUser } = useUnblockUser();
  const activeStatus = params.status ?? "";
  const currentPage = data.pagination.page;
  const totalPages = data.pagination.totalPage;

  useEffect(() => {
    if ((params.searchTerm ?? "") === debouncedSearchTerm) {
      return;
    }

    onParamsChange({
      ...params,
      searchTerm: debouncedSearchTerm,
      page: 1
    });
  }, [debouncedSearchTerm, onParamsChange, params]);

  const stats = useMemo(
    () => [
      { id: "total", title: "Total Users", value: String(data.pagination.total) },
      {
        id: "active",
        title: "Active Users",
        value: String(data.data.filter((user) => user.status === "ACTIVE").length)
      },
      {
        id: "restricted",
        title: "Restricted",
        value: String(data.data.filter((user) => user.status === "RESTRICTED").length)
      },
      {
        id: "verified",
        title: "Verified",
        value: String(data.data.filter((user) => user.verified).length)
      }
    ],
    [data.data, data.pagination.total]
  );

  const handleStatusChange = (status: string) => {
    onParamsChange({ ...params, status: status as UserManageStatus | "", page: 1 });
  };

  const handlePageChange = (page: number) => {
    onParamsChange({ ...params, page });
  };

  const handleToggleBlock = async (userId: string, status: UserManageStatus) => {
    const shouldUnblock = status === "RESTRICTED";

    try {
      if (shouldUnblock) {
        await unblockUser({ userId });
      } else {
        await blockUser({ userId });
      }

      toast({
        title: "Success",
        description: shouldUnblock ? "User unblocked successfully." : "User blocked successfully.",
        variant: "default"
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Unable to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const activeStatusLabel =
    STATUS_OPTIONS.find((option) => option.value === activeStatus)?.label ?? "All";
  const isMutating = isBlockingUser || isUnblockingUser;

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage and monitor all platform users</p>
      </header>

      <Card className="m-0 border-none bg-white p-0 shadow-none">
        <CardContent className="space-y-5 p-0">
          <Card className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email..."
                className="bg-white pl-9"
                aria-label="Search users"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-primary bg-white">
                    <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs text-muted-foreground">
                      <Filter className="h-3 w-3" />
                    </span>
                    {activeStatusLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuRadioGroup value={activeStatus} onValueChange={handleStatusChange}>
                    {STATUS_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.value || "all"} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="default" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
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
                  {data.data.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="bg-muted" size="sm">
                            <AvatarImage src={user.profilePicture} alt={user.name} />
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
                        {user.enrollmentCount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActiveDate ? formatDate(user.lastActiveDate) : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2 text-muted-foreground">
                          <Link href={`/user-management/${user._id}`}>
                            <Button variant="ghost" size="icon-sm" aria-label="View user">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant={user.status === "RESTRICTED" ? "default" : "outline"}
                            size="sm"
                            disabled={isMutating}
                            onClick={() => handleToggleBlock(user._id, user.status)}
                          >
                            {user.status === "RESTRICTED" ? "Unblock" : "Block"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {data.data.length} of {data.pagination.total} users
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isActive = page === currentPage;
                    return (
                      <Button
                        key={`page-${page}`}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={isActive ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
