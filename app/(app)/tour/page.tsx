import CreateTouristDialog from "@/components/tourist/CreateTouristDialog";
import SearchSection from "@/components/Search";
import UpdateTouristDialog from "@/components/tourist/UpdateTouristDialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { formatAge, getAge } from "@/lib/utils";
import { getAllTourists } from "@/tourist/service";
import { FileText, LucideMail, Phone, User, Users } from "lucide-react";
import DeleteTouristButton from "@/components/tourist/DeleteTouristButton";
import { getAllTours } from "@/tour/service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TouristPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const search = (await searchParams).search;

  const tours = await getAllTours({ name: search });

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Туры</h1>
        <Button asChild>
          <Link href="/tour/new">Создать тур</Link>
        </Button>
      </div>
      <Card className="p-4">
        <div className="flex flex-row items-center justify-between p-4 rounded">
          <div>
            <h2 className="text-xl font-semibold">Список туров</h2>
            <p className="text-muted-foreground text-base">
              Всего туров по запросу: {tours.length}
            </p>
          </div>
          <SearchSection className="w-80" value={search} />
        </div>
        <ul className="space-y-4">
          {tours.length === 0 && (
            <Item className="flex items-center justify-center text-2xl text-muted-foreground">
              Нет туров
            </Item>
          )}
          {tours.map((tour) => (
            <Card key={tour.id} className="shadow-none">
              <CardHeader>
                <CardTitle>{tour.name}</CardTitle>
                <CardDescription>
                  {tour.date.toLocaleDateString()}
                </CardDescription>
                <CardAction>
                  <Button asChild>
                    <Link href={`/tour/${tour.id}`}>Подробнее</Link>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center gap-4">
                  <div className="flex-1 flex flex-row items-center gap-4 p-4 rounded-md bg-bg-color/50">
                    <User className="text-primary" />
                    <div>
                      <h3 className="text-base text-muted-foreground">
                        Заказчик
                      </h3>
                      <span className="font-semibold">
                        {tour.customer?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-row items-center gap-4 p-4 rounded-md bg-bg-color/50">
                    <Users className="text-primary" />
                    <div>
                      <h3 className="text-base text-muted-foreground">
                        Туристы
                      </h3>
                      <span className="font-semibold">
                        {tour.tourists.length} человек
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-row items-center gap-4 p-4 rounded-md bg-bg-color/50">
                    <FileText className="text-primary" />
                    <div>
                      <h3 className="text-base text-muted-foreground">
                        Документы
                      </h3>
                      <span className="font-semibold">
                        {tour.templates.length} шаблонов
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </Card>
    </div>
  );
}
