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
import { getAllTemplates } from "@/template/service";
import { createTourAction } from "@/tour/actions";
import { getAllTourists } from "@/tourist/service";
import Link from "next/link";

export default async function NewTourPage() {
  const tourists = await getAllTourists();
  const templates = await getAllTemplates();

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Новый тур</h1>
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
      <TourForm
        action={createTourAction}
				doRedirect={true}
        tourists={tourists}
        templates={templates}
      />
    </div>
  );
}
