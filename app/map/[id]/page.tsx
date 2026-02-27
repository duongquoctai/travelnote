import MapLoader from "../../[map]/MapLoader";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="grid grid-rows-[1fr_auto] h-screen overflow-hidden font-(family-name:--font-geist-sans)">
      <main className="w-full h-full">
        <MapLoader journeyId={id} />
      </main>
    </div>
  );
}
