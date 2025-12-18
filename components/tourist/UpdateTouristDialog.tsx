"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { updateTouristAction } from "@/tourist/actions";
import TouristForm from "./TouristForm";
import { Tourist, UpdateTourist } from "@/tourist/schema";
import { useState } from "react";

export default function UpdateTouristDialog({ data }: { data: Tourist }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Изменить туриста</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить туриста</DialogTitle>
          <DialogDescription>Введите новые данные туриста</DialogDescription>
        </DialogHeader>
        <TouristForm
          toastMessage="Турист успешно изменен"
          defaultData={data}
          action={async (newData: UpdateTourist) => {
            const result = await updateTouristAction(data.id, newData);
            setIsOpen(false);
            return result;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
