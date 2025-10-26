import { formatDistanceToNow as fnsFormatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

/**
 * Brazil timezone constant (São Paulo/Brasilia)
 */
const BRAZIL_TIMEZONE = "America/Sao_Paulo";

/**
 * Formats an ISO date string to Brazilian date/time format with Brazil timezone
 * @param isoDate - ISO 8601 date string (e.g., "2025-10-13T00:15:41.308Z")
 * @returns Formatted date string (e.g., "13/10/2025 às 21:15" in Brazil time)
 */
export function formatOrderDate(isoDate: string): string {
	const date = new Date(isoDate);

	return date.toLocaleString("pt-BR", {
		timeZone: BRAZIL_TIMEZONE,
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Formats a date to Brazilian date format (DD/MM/YYYY) with Brazil timezone
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "13/10/2025")
 */
export function formatDate(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;

	return dateObj.toLocaleDateString("pt-BR", {
		timeZone: BRAZIL_TIMEZONE,
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * Formats a date to Brazilian date/time format with Brazil timezone
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "13/10/2025 às 21:15")
 */
export function formatDateTime(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;

	const formatted = dateObj.toLocaleString("pt-BR", {
		timeZone: BRAZIL_TIMEZONE,
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	// Replace comma with " às" for Portuguese formatting
	return formatted.replace(",", " às");
}

/**
 * Formats a date to short Brazilian date format (day and abbreviated month)
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "13 de out")
 */
export function formatDateShort(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;

	return dateObj.toLocaleDateString("pt-BR", {
		timeZone: BRAZIL_TIMEZONE,
		day: "2-digit",
		month: "short",
	});
}

/**
 * Formats a relative date in Brazilian Portuguese with Brazil timezone
 * @param date - Date object or ISO string
 * @returns Formatted relative date string (e.g., "há 2 minutos", "há 3 horas")
 */
export function formatRelativeDate(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	// Convert to Brazil timezone before formatting
	const zonedDate = toZonedTime(dateObj, BRAZIL_TIMEZONE);

	return fnsFormatDistanceToNow(zonedDate, {
		addSuffix: true,
		locale: ptBR,
	});
}
