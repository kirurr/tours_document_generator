"use server";

import { TemplateFormValues } from "@/components/template/TemplateForm";
import { ActionResponse } from "@/lib/utils";
import {
  createTemplateWithCustomFields,
  deleteTemplate,
  updateTemplateWithCustomFields,
} from "./service";

export async function deleteTemplateAction(id: number): Promise<ActionResponse> {
  try {
    await deleteTemplate(id);
    return {
      success: true,
      message: "Template deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to delete template",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateTemplateAction(
  id: number,
  data: TemplateFormValues,
): Promise<ActionResponse> {
  try {
    await updateTemplateWithCustomFields(id, data, data.customFields);
    return {
      success: true,
      message: "Template updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update template",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createTemplateAction(
  data: TemplateFormValues,
): Promise<ActionResponse> {
  try {
    await createTemplateWithCustomFields(data, data.customFields);
    return {
      success: true,
      message: "Template created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create template",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
