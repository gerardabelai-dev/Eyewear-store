import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userNotificationSettings } from "@/lib/db/schema";

// POST - Unsubscribe user from all non-essential notifications
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId } = body;

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		// Check if user preferences exist
		const existingPreferences = await db
			.select()
			.from(userNotificationSettings)
			.where(eq(userNotificationSettings.userId, userId))
			.limit(1);

		// Unsubscribe from all marketing communications but keep essential ones
		const unsubscribeData = {
			marketing: false,
			orderUpdates: true, // Keep order updates for transactional purposes
			systemNotifications: false,
			promotions: false,
			newsletters: false,
			emailEnabled: true, // Keep email enabled for essential communications
			smsEnabled: false,
			pushEnabled: false,
			whatsappEnabled: false,
			updatedAt: new Date(),
		};

		let updatedPreferences: any;

		if (existingPreferences.length === 0) {
			// Create new preferences if they don't exist
			const newPreferences = {
				id: nanoid(),
				userId,
				createdAt: new Date(),
				...unsubscribeData,
			};

			await db.insert(userNotificationSettings).values(newPreferences);

			updatedPreferences = newPreferences;
		} else {
			// Update existing preferences
			await db
				.update(userNotificationSettings)
				.set(unsubscribeData)
				.where(eq(userNotificationSettings.userId, userId));

			// Fetch updated preferences
			const result = await db
				.select()
				.from(userNotificationSettings)
				.where(eq(userNotificationSettings.userId, userId))
				.limit(1);

			updatedPreferences = result[0];
		}

		return NextResponse.json({
			success: true,
			message: "Successfully unsubscribed from all non-essential notifications",
			preferences: updatedPreferences,
		});
	} catch (error) {
		console.error("Error unsubscribing from all notifications:", error);
		return NextResponse.json(
			{ error: "Failed to unsubscribe from notifications" },
			{ status: 500 },
		);
	}
}
