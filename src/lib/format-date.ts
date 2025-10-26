/**
 * Formats an ISO date string to Brazilian date/time format
 * @param isoDate - ISO 8601 date string (e.g., "2025-10-13T00:15:41.308Z")
 * @returns Formatted date string (e.g., "13/10/2025 às 00:15")
 */
export function formatOrderDate(isoDate: string): string {
	const date = new Date(isoDate);

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}/${month}/${year} às ${hours}:${minutes}`;
}
