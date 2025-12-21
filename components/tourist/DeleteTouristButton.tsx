"use client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deleteTouristAction } from "@/tourist/actions";

export default function DeleteTouristButton({ id }: { id: number }) {
  return (
    <Button
      className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
      onClick={async () => {
        const result = await deleteTouristAction(Number(id));
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
      }}
    >
      <Trash /> Удалить
    </Button>
  );
}
