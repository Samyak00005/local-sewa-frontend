export const DEFAULT_WHATSAPP_MESSAGE = "Hello, I am here";

export function buildWhatsAppUrl(number, message = DEFAULT_WHATSAPP_MESSAGE) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
