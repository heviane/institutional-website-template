import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a phone number and formats a secure link for WhatsApp API.
 * Automatically ensures Brazilian country code (55) if not present.
 */
export function formatWhatsAppUrl(phone: string, text?: string): string {
  const cleanDigits = phone.replace(/\D/g, "");
  const normalizedNumber = cleanDigits.startsWith("55") ? cleanDigits : `55${cleanDigits}`;
  const baseUrl = `https://wa.me/${normalizedNumber}`;
  return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}

/**
 * Sanitizes a phone number for RFC 3966 tel: protocol links with country code prefix.
 */
export function formatTelUrl(phone: string): string {
  const cleanDigits = phone.replace(/\D/g, "");
  const normalizedNumber = cleanDigits.startsWith("55") ? cleanDigits : `55${cleanDigits}`;
  return `tel:+${normalizedNumber}`;
}

/**
 * Formats a phone number for human-readable display in Brazilian format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX.
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const localDigits = digits.startsWith("55") ? digits.slice(2) : digits;
  if (localDigits.length === 11) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
  }
  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
  }
  return phone;
}
