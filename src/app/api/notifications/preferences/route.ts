import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userNotificationSettings } from "@/lib/db/schema";
import type { NotificationPreferences } from "@/lib/notifications/types";

// GET - Fetch user notification preferences
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		// Check if user preferences exist
		let preferences = await db
			.select()
			.from(userNotificationSettings)
			.where(eq(userNotificationSettings.userId, userId))
			.limit(1);

		// If no preferences exist, create default ones
		if (preferences.length === 0) {
			const defaultPreferences = {
				id: nanoid(),
				userId,
				marketing: true,
				orderUpdates: true,
				systemNotifications: true,
				promotions: true,
				newsletters: true,
				emailEnabled: true,
				smsEnabled: false,
				pushEnabled: true,
				whatsappEnabled: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			await db.insert(userNotificationSettings).values(defaultPreferences);

			preferences = [defaultPreferences];
		}

		return NextResponse.json({
			success: true,
			preferences: preferences[0],
		});
	} catch (error) {
		console.error("Error fetching notification preferences:", error);
		return NextResponse.json(
			{ error: "Failed to fetch preferences" },
			{ status: 500 },
		);
	}
}

// PUT - Update user notification preferences
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId, preferences } = body;

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		if (!preferences || typeof preferences !== "object") {
			return NextResponse.json(
				{ error: "Preferences object is required" },
				{ status: 400 },
			);
		}

		// Check if user preferences exist
		const existingPreferences = await db
			.select()
			.from(userNotificationSettings)
			.where(eq(userNotificationSettings.userId, userId))
			.limit(1);

		const updateData = {
			...preferences,
			updatedAt: new Date(),
		};

		let updatedPreferences: any;

		if (existingPreferences.length === 0) {
			// Create new preferences if they don't exist
			const newPreferences = {
				id: nanoid(),
				userId,
				marketing: true,
				orderUpdates: true,
				systemNotifications: true,
				promotions: true,
				newsletters: true,
				emailEnabled: true,
				smsEnabled: false,
				pushEnabled: true,
				whatsappEnabled: false,
				createdAt: new Date(),
				...updateData,
			};

			await db.insert(userNotificationSettings).values(newPreferences);

			updatedPreferences = newPreferences;
		} else {
			// Update existing preferences
			await db
				.update(userNotificationSettings)
				.set(updateData)
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
			preferences: updatedPreferences,
		});
	} catch (error) {
		console.error("Error updating notification preferences:", error);
		return NextResponse.json(
			{ error: "Failed to update preferences" },
			{ status: 500 },
		);
	}
}
