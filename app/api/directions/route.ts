import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { coordinates } = await request.json();

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return NextResponse.json(
        { error: "At least two coordinates are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPEN_ROUTE_SERVICE_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouteService API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Directions API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch directions" },
      { status: 500 },
    );
  }
}
