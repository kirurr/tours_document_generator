import SearchSection from "@/components/Search";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllTemplates } from "@/template/service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function TouristPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const search = (await searchParams).search;

  const templates = await getAllTemplates({
    name: search,
    description: search,
  });

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Шаблоны документов</h1>
        <Button asChild>
          <Link href="/template/new">Создать шаблон</Link>
        </Button>
      </div>
      <Card className="p-4">
        <div className="flex flex-row items-center justify-between p-4 rounded">
          <div>
            <h2 className="text-xl font-semibold">Список шаблонов</h2>
            <p className="text-muted-foreground text-base">
              Всего шаблонов по запросу: {templates.length}
            </p>
          </div>
          <SearchSection className="w-80" value={search} />
        </div>
        <ul className="space-y-4 grid grid-cols-3 gap-4">
          {templates.length === 0 && (
            <Card className="flex items-center justify-center text-2xl text-muted-foreground shadow-none p-4">
              Нет шаблонов
            </Card>
          )}
          {templates.map((template) => (
            <Card key={template.id} className="shadow-none">
              <CardHeader>
								<div className="flex flex-row items-center justify-between">
									<FileText />
                  <Button asChild>
                    <Link href={`/template/${template.id}`}>
                      <SquarePen /> Редактировать
                    </Link>
                  </Button>
								</div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base mb-2">
                  Используемые поля:
                </p>
                <div>
                  {template.customFields.map((field) => (
                    <Badge key={field.id} variant={"secondary"}>
                      {field.displayName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </Card>
    </div>
  );
}
