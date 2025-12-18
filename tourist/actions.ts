"use server";

import { revalidatePath } from "next/cache";
import { TouristService } from "./service";
import { CreateTourist, UpdateTourist } from "./schema";
import { ActionResponse } from "@/lib/utils";

/**
 * Server action to create a new tourist
 */
export async function createTouristAction(
  data: CreateTourist,
): Promise<ActionResponse> {
  try {
    const newTourist = await TouristService.createTourist(data);

    revalidatePath("/"); // Revalidate home page or any page that might use this data

    return {
      success: true,
      message: "Tourist created successfully",
      data: newTourist,
    };
  } catch (error) {
    console.error("Error creating tourist:", error);

    return {
      success: false,
      message: "Failed to create tourist",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Server action to update an existing tourist
 */
export async function updateTouristAction(
  id: number,
  data: UpdateTourist,
): Promise<ActionResponse> {
  try {
    // Verify the tourist exists before trying to update
    const existingTourist = await TouristService.getTouristById(id);
    if (!existingTourist) {
      return {
        success: false,
        message: "Tourist not found",
        error: "Tourist not found",
      };
    }

    const updatedTourist = await TouristService.updateTourist(id, data);

    if (!updatedTourist) {
      return {
        success: false,
        message: "Failed to update tourist",
        error: "Update operation did not return a tourist",
      };
    }

    revalidatePath("/"); // Revalidate affected pages

    return {
      success: true,
      message: "Tourist updated successfully",
      data: updatedTourist,
    };
  } catch (error) {
    console.error("Error updating tourist:", error);

    return {
      success: false,
      message: "Failed to update tourist",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Server action to delete a tourist
 */
export async function deleteTouristAction(
  id: number,
): Promise<ActionResponse<boolean>> {
  try {
    const touristToDelete = await TouristService.getTouristById(id);
    if (!touristToDelete) {
      return {
        success: false,
        message: "Tourist not found",
        error: "Tourist not found",
      };
    }

    const isDeleted = await TouristService.deleteTourist(id);

    if (!isDeleted) {
      return {
        success: false,
        message: "Failed to delete tourist",
        error: "Delete operation failed",
      };
    }

    revalidatePath("/"); // Revalidate affected pages

    return {
      success: true,
      message: "Tourist deleted successfully",
      data: isDeleted,
    };
  } catch (error) {
    console.error("Error deleting tourist:", error);

    return {
      success: false,
      message: "Failed to delete tourist",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
