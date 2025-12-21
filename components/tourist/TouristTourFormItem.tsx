import { formatAge, getAge } from "@/lib/utils";
import { Tourist } from "@/tourist/schema";
import { User, LucideMail, Phone, X } from "lucide-react";
import { Item, ItemActions, ItemContent } from "../ui/item";
import UpdateTouristDialog from "./UpdateTouristDialog";
import { Button } from "../ui/button";

export default function TouristTourFormItem({
  tourist,
  remove,
}: {
  tourist: Tourist;
  remove: () => void;
}) {
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
      </ItemContent>
      <ItemActions>
        <UpdateTouristDialog data={tourist} />
        <Button
          onClick={remove}
          className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
          size="icon"
        >
          <X />
        </Button>
      </ItemActions>
    </Item>
  );
}
