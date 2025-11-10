/**
 * Test script to simulate the prescription reminder cron job
 * Run with: pnpm tsx scripts/test-cron.ts
 */

import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });
config();

async function testCronJob() {
	console.log("🧪 Testing prescription reminder cron job...\n");

	const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
	const cronSecret = process.env.CRON_SECRET || "your-secret-key-here-change-in-production";

	console.log(`📍 Base URL: ${baseUrl}`);
	console.log(`🔑 Using CRON_SECRET: ${cronSecret.substring(0, 10)}...\n`);

	try {
		const response = await fetch(
			`${baseUrl}/api/cron/send-prescription-reminders`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${cronSecret}`,
				},
			},
		);

		console.log(`📊 Response Status: ${response.status} ${response.statusText}\n`);

		const data = await response.json();

		console.log("📦 Response Data:");
		console.log(JSON.stringify(data, null, 2));

		if (data.success) {
			console.log("\n✅ Cron job executed successfully!");
			console.log(`   - Total Orders: ${data.totalOrders}`);
			console.log(`   - Emails Sent: ${data.sentCount}`);
			console.log(`   - Errors: ${data.errorCount}`);
		} else {
			console.log("\n❌ Cron job failed");
		}
	} catch (error) {
		console.error("\n❌ Error testing cron job:");
		console.error(error);
		process.exit(1);
	}
}

// Run the test
testCronJob();
