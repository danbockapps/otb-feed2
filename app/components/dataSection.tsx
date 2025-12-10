import getPlayer from "../lib/getPlayer";

export default async function DataSection() {
  const data = await getPlayer("12663913"); // Server fetch

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold">Loaded Data</h2>
      <p>{JSON.stringify(data)}</p>
      <p className="text-sm text-gray-500">timestamp: {data.timestamp}</p>
    </div>
  );
}
