import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Capitalizes the first letter of a string and lowercases the rest.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function cap(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
