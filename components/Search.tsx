"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SearchSection({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      search: value ?? "",
    },
  });

  function onSubmit({ search }: { search: string }) {
    const params = new URLSearchParams(searchParams);
    params.set("search", search);
    router.push(`?${params.toString()}`);
  }
  return (
    <form
      className={cn("flex flex-row gap-2 items-center", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="search"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Поиск"
          />
        )}
      />
      <Button>Искать</Button>
    </form>
  );
}
