import TemplateForm from "@/components/template/TemplateForm";
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
import { getAllCustomFields } from "@/custom-fields/service";
import { createTemplateAction } from "@/template/actions";
import Link from "next/link";

export default async function NewTemplatePage() {
  const systemCustomFields = await getAllCustomFields();

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Новый шаблон</h1>
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
      <TemplateForm
        systemCustomFields={systemCustomFields}
        toastMessage="Шаблон создан"
        action={async (data) => {
          "use server";
          return await createTemplateAction(data);
        }}
      />
    </div>
  );
}
