import DeleteTemplateButton from "@/components/template/DeleteTemplateButton";
import TemplateForm, {
  TemplateFormValues,
} from "@/components/template/TemplateForm";
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
import {
  updateTemplateAction,
} from "@/template/actions";
import { getTemplateById } from "@/template/service";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const template = await getTemplateById(Number(id));
  if (!template) {
    return notFound();
  }

  const systemCustomFields = await getAllCustomFields();

  return (
    <div className="p-8 space-y-8 container mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Редактирование шаблона</h1>
        <div className="flex gap-2 items-center">
					<DeleteTemplateButton id={template.id} />
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
      </div>
      <TemplateForm
        systemCustomFields={systemCustomFields}
        defaultData={template as TemplateFormValues}
        toastMessage="Шаблон обновлен"
        action={async (data) => {
          "use server";
          return await updateTemplateAction(Number(id), data);
        }}
      />
    </div>
  );
}
