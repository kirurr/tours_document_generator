import ConvertButton from "@/components/tour/ConvertButton";
import TourForm from "@/components/tour/TourForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllTemplates } from "@/template/service";
import { updateTourAction } from "@/tour/actions";
import { getTourById } from "@/tour/service";
import { getAllTourists } from "@/tourist/service";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getTourById(Number(id));
  if (!tour) {
    notFound();
  }

  const tourists = await getAllTourists();
  const templates = await getAllTemplates();

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Редактировать тур</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Назад</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Ваши изменения будут утеряны.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link href="/template">Уйти</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Получить документы по туру</CardTitle>
          <CardDescription>
            Внимание: сохраните данные перед получением документов
          </CardDescription>
          <CardAction>
            <ConvertButton tour={tour} />
          </CardAction>
        </CardHeader>
      </Card>
      <TourForm
        defaultData={{
          ...tour,
          touristsIds: tour.tourists.map((tourist) => tourist.id.toString()),
          customerId: tour.customer!.id.toString(),
          templatesIds: tour.templates.map((template) =>
            template.id.toString(),
          ),
          customFieldsArary: tour.customFieldsValues.map((field) => ({
            customFieldId: field.customFieldId,
            documentTemplateId:
              tour.templates.find((t) =>
                t.customFields.find((f) => f.documentTemplateId === t.id),
              )?.id ?? 0,
            value: field.value,
          })),
        }}
        action={async (data) => {
          "use server";
          return await updateTourAction(tour.id, data);
        }}
        doRedirect={false}
        tourists={tourists}
        templates={templates}
      />
    </div>
  );
}
