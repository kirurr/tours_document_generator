"use client";

import { TourWithData } from "@/tour/schema";
import Handlebars from "handlebars";
import { Button } from "../ui/button";
import { Tourist } from "@/tourist/schema";
import { getDocxBlobFromHTML } from "@/tour/actions";

export default function ConvertButton({ tour }: { tour: TourWithData }) {
  //TODO: convert to canvas then to pdf
  async function onClick() {
    for (const template of tour.templates) {
      const compiled = Handlebars.compile(template.body);
      const data: Record<string, string | Tourist[] | Tourist> = {};
      for (const field of template.customFields) {
        data[field.name] =
          tour.customFieldsValues.find((f) => f.customFieldId === field.id)
            ?.value ?? "";
      }
      data["tourists"] = tour.tourists;

      let html = compiled(data);
      html = `<!DOCTYPE html><body>${html}</body></html>`;
      html = html
        .replace(/<template-variable[^>]*>/g, "<span>")
        .replace(/<\/template-variable>/g, "</span>")
        .replace(/<template-loop[^>]*>/g, "<div>")
        .replace(/<\/template-loop>/g, "</div>")
        .replace(/<template-open[^>]*>/g, "")
        .replace(/<\/template-open>/g, "")
        .replace(/<template-close[^>]*>/g, "")
        .replace(/<\/template-close>/g, "");
      console.log(html);

      const docx = await getDocxBlobFromHTML(html);
      if (!docx) throw new Error("Failed to convert to docx");
      const url = URL.createObjectURL(docx);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${tour.name}.docx`;
      link.click();
    }
  }
  return <Button onClick={onClick}>Скачать</Button>;
}
