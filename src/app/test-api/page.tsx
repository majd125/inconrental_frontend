'use client';

import { useEffect, useState } from 'react';

export default function TestApi() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

        fetch(`${apiUrl}/vehicules`, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">API Connection Test</h1>

            {loading && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                    Connecting to backend...
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                    <h2 className="font-bold">Connection Failed</h2>
                    <p>{error}</p>
                    <p className="text-xs mt-2 text-gray-500">
                        Make sure your Laravel server is running (<code>php artisan serve</code>)
                        and that CORS is properly configured in <code>bootstrap/app.php</code>.
                    </p>
                </div>
            )}

            {data && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-400">
                    <h2 className="font-bold">Connection Successful!</h2>
                    <p className="text-sm">Found {data.count} vehicles in the database.</p>
                    <pre className="mt-4 p-4 bg-black/40 rounded overflow-auto max-h-96 text-xs text-gray-600">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}

            <div className="pt-6 border-t border-gray-200">
                <a href="/" className="text-black hover:underline flex items-center gap-2">
                    &larr; Back to Home
                </a>
            </div>
        </div>
    );
}
