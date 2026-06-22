"use server";
import { FormSchema } from "./schema";

export async function submitFormAction(
  data: FormSchema
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  console.log("Submitting:", data);
  return { success: true, id: "example-id" };
}
