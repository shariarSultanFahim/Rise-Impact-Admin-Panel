import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface EditingUser {
  id: string;
  name: string;
  status: string;
}

interface UserDialogsProps {
  editingUser: EditingUser | null;
  onEditClose: () => void;
  editedStatus: string;
  onStatusChange: (status: string) => void;
  onEditSave: () => void;
  deleteUserId: string | null;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
  statuses: string[];
}

export default function UserDialogs({
  editingUser,
  onEditClose,
  editedStatus,
  onStatusChange,
  onEditSave,
  deleteUserId,
  onDeleteClose,
  onDeleteConfirm,
  statuses
}: UserDialogsProps) {
  return (
    <>
      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => onEditClose()}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user role and status</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input value={editingUser.name} disabled className="cursor-not-allowed bg-muted" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="status-select" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select value={editedStatus} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full" id="status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => onEditClose()} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={onEditSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteUserId} onOpenChange={() => onDeleteClose()}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => onDeleteClose()} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} className="flex-1">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
