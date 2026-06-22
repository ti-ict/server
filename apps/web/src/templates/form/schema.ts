import { z } from "zod";

export const formSchema = z.object({
  fieldOne: z.string().min(1, "Field one is required"),
  fieldTwo: z.string().min(1, "Field two is required")
  // Add more fields as needed
});

export type FormSchema = z.infer<typeof formSchema>;
