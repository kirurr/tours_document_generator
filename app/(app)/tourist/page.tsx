import CreateTouristDialog from "@/components/tourist/CreateTouristDialog";
import SearchSection from "@/components/Search";
import UpdateTouristDialog from "@/components/tourist/UpdateTouristDialog";
import { Card } from "@/components/ui/card";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { formatAge, getAge } from "@/lib/utils";
import { getAllTourists } from "@/tourist/service";
import { LucideMail, Phone } from "lucide-react";

export default async function TouristPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const search = (await searchParams).search;
  const tourists = await getAllTourists({
    email: search,
    name: search,
    phone: search,
  });

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Туристы</h1>
        <CreateTouristDialog />
      </div>
      <Card className="p-4">
        <div className="flex flex-row items-center justify-between p-4 rounded">
          <div>
            <h2 className="text-xl font-semibold">Список туристов</h2>
            <p className="text-muted-foreground text-base">
              Всего туристов по запросу: {tourists.length}
            </p>
          </div>
          <SearchSection className="w-80" value={search} />
        </div>
        <ul className="space-y-4">
          {tourists.length === 0 && (
            <Item className="flex items-center justify-center text-2xl text-muted-foreground">
              Нет туриcтов
            </Item>
          )}
          {tourists.map((tourist) => (
            <Item key={tourist.id} variant="outline">
              <ItemContent className="grid grid-cols-[1fr_auto] gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {tourist.name}{" "}
                    <span className="text-muted-foreground ml-4">
                      {formatAge(getAge(tourist.dateOfBirth))}
                    </span>
                  </h3>
                  <div className="flex flex-row gap-2">
                    <p className="text-base text-muted-foreground flex items-center gap-1">
                      <LucideMail className="size-4" /> {tourist.email}
                    </p>
                    <p className="text-base text-muted-foreground flex items-center gap-1">
                      <Phone className="size-4" /> {tourist.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-muted-foreground text-base mb-2 block">
                      Дата рождения:
                    </span>
                    <span className="text-base">
                      {tourist.dateOfBirth?.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-base mb-2 block">
                      Паспорт:
                    </span>
                    <span className="text-base">{tourist.passport}</span>
                  </div>
                </div>
              </ItemContent>
              <ItemActions>
                <UpdateTouristDialog data={tourist} />
              </ItemActions>
            </Item>
          ))}
        </ul>
      </Card>
    </div>
  );
}
