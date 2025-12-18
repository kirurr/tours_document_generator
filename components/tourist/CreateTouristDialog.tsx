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
import { createTouristAction } from "@/tourist/actions";
import TouristForm from "./TouristForm";
import { useState } from "react";
import { CreateTourist } from "@/tourist/schema";

export default function CreateTouristDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Создать туриста</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать туриста</DialogTitle>
					<DialogDescription>Введите данные туриста</DialogDescription>
        </DialogHeader>
        <TouristForm
          toastMessage="Турист успешно создан"
          action={async (data: CreateTourist) => {
            const result = await createTouristAction(data);
            setIsOpen(false);
            return result;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
