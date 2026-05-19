"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddUserForm } from "./add-user-form";

export default function AddUserButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="absolute right-0">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <AddUserForm setDialogOpen={setDialogOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
