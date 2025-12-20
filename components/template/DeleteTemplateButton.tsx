"use client";
import { deleteTemplateAction } from "@/template/actions";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function DeleteTemplateButton({ id }: { id: number }) {
  return (
    <Button
      className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
      onClick={async () => {
        const result = await deleteTemplateAction(Number(id));
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        redirect("/template");
      }}
    >
      <Trash /> Удалить
    </Button>
  );
}
