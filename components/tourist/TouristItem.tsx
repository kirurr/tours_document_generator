import { formatAge, getAge } from "@/lib/utils";
import { Tourist } from "@/tourist/schema";
import { User, LucideMail, Phone } from "lucide-react";
import { Item, ItemActions, ItemContent } from "../ui/item";
import DeleteTouristButton from "./DeleteTouristButton";
import UpdateTouristDialog from "./UpdateTouristDialog";

export default function TouristItem({ tourist }: { tourist: Tourist }) {
  return (
    <Item key={tourist.id} variant="outline">
      <ItemContent className="grid grid-cols-[1fr_auto] gap-6">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row items-center justify-center p-2 size-14 rounded-full bg-bg-color">
            <User />
          </div>
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
        <DeleteTouristButton id={tourist.id} />
      </ItemActions>
    </Item>
  );
}
