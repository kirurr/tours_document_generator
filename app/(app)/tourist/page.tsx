import CreateTouristDialog from "@/components/tourist/CreateTouristDialog";
import SearchSection from "@/components/Search";
import { Card } from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import { getAllTourists } from "@/tourist/service";
import TouristItem from "@/components/tourist/TouristItem";

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
            <TouristItem key={tourist.id} tourist={tourist} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
