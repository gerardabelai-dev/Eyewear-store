import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserProfileQuery } from "@/lib/queries/user";

export async function GET() {
	const user = await getCurrentUser();
	// Fetch profile data
	const profile = await getUserProfileQuery();
	return NextResponse.json(profile);
}
