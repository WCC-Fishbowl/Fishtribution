import { auth } from '@/lib/auth/server';
import { getTestData, getUserSettings } from '@/lib/db';


export default async function HomePage() {
  try {
    const { data: session, error } = await auth.getSession();
    const data = session ? await getUserSettings(session) : null;
    
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
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="p-8 text-red-600">
        <p className="text-xl font-bold">Connection Failed</p>
        <p>Check your DATABASE_URL environment variable</p>
        <pre className="mt-4 bg-red-100 p-4 rounded overflow-auto">
          {String(error)}
        </pre>
      </div>
    );
  }
}