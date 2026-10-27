import { getTestData } from '@/lib/db';

export default async function HomePage() {
  try {
    const data = await getTestData();

    return (
      <div className="p-8 font-sans">
        <p className="text-3xl font-title font-semibold mb-4">Test Table Contents</p>
        
        {data.length === 0 ? (
          <p>No records found</p>
        ) : (
          <div className="overflow-x-auto font-mono">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="border p-2 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border p-2">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fish list */}
      <div className="mt-6 flex flex-col gap-6">
        <FishRow fish={fishes[0]} imageSide="left" />
        <div className="grid grid-cols-2 gap-4">
          <FishTile fish={fishes[1]} imagePosition="top" />
          <FishTile fish={fishes[2]} imagePosition="bottom" />
        </div>
        <FishRow fish={fishes[3]} imageSide="right" />
      </div>
    </div>
  )
}