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

/*
 * Generates a random password of a given length.
 * @param length - The length of the password to generate. Default is 20.
 * @returns A randomly generated password.
 */
export function generatePassword(length: number = 20): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes)
    .map((byte) => characters[byte % characters.length])
    .join("");
}
