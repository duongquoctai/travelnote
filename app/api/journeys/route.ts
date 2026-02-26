import { authOptions } from "@/app/libs/auth";
import dbConnect from "@/app/libs/mongodb";
import Journey from "@/app/models/Journey";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { locations } = body;

    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { error: "Invalid locations data" },
        { status: 400 },
      );
    }

    await dbConnect();

    const journey = await Journey.create({
      userId: (session.user as { id: string }).id,
      name: "Vi vu",
      locations,
    });

    return NextResponse.json(journey);
  } catch (error) {
    console.error("Save journey error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const journeys = await Journey.find({
      userId: (session.user as { id: string }).id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(journeys);
  } catch (error) {
    console.error("Fetch journeys error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
