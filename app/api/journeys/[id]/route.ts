import { authOptions } from "@/app/libs/auth";
import dbConnect from "@/app/libs/mongodb";
import Journey from "@/app/models/Journey";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    await dbConnect();

    const journey = await Journey.findOneAndUpdate(
      {
        _id: id,
        userId: (session.user as { id: string }).id,
      },
      { name },
      { new: true },
    );

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    return NextResponse.json(journey);
  } catch (error) {
    console.error("Update journey error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
