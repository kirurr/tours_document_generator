import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { getAllTemplates } from "@/template/service";
import { getAllTours } from "@/tour/service";
import { getAllTourists } from "@/tourist/service";
import { Briefcase, FileText, Users } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const tourists = await getAllTourists();
  const tours = await getAllTours();
  const templates = await getAllTemplates();

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Главная</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Обзор системы управления документами
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 *:flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Всего туристов</CardTitle>
            <CardAction>
              <Users className="text-primary" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-3xl">{tourists.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Всего туров</CardTitle>
            <CardAction>
              <Briefcase className="text-primary" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-3xl">{tours.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Всего шаблонов</CardTitle>
            <CardAction>
              <FileText className="text-primary" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-3xl">{templates.length}</span>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row items-stretch gap-4 *:flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Последние туры</CardTitle>
            <CardDescription>
              Последние туры с последними документами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tours.map((tour) => (
                <li key={tour.id}>
                  <Item variant='muted'>
                    <ItemContent>
                      <ItemTitle>{tour.name}</ItemTitle>
                      <ItemDescription>
                        {tour.tourists.length} туристов -{" "}
                        {tour.date.toLocaleDateString()}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button asChild variant={"outline"}>
                        <Link href={`/tour/${tour.id}`}>Просмотр</Link>
                      </Button>
                    </ItemActions>
                  </Item>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Часто используемые действия</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  className="p-2 rounded-md bg-muted flex flex-row items-center gap-4"
                  href="/tour/new"
                >
                  <Briefcase /> Создать новый тур
                </Link>
              </li>
              <li>
                <Link
                  className="p-2 rounded-md bg-muted flex flex-row items-center gap-4"
                  href="/tourist"
                >
                  <Users /> Управление туристами
                </Link>
              </li>
              <li>
                <Link
                  className="p-2 rounded-md bg-muted flex flex-row items-center gap-4"
                  href="/templates"
                >
                  <FileText /> Редактировать шаблоны
                </Link>
              </li>
              <li>
                <Link
                  className="p-2 rounded-md bg-muted flex flex-row items-center gap-4"
                  href="/tour"
                >
                  <Briefcase /> Редактировать туры
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
