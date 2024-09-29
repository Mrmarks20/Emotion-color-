import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Entry {
  date: string;
  emotion: {
    name: string;
    color: string;
  };
  entry: string;
}

export default function SharedDiary() {
  const router = useRouter();
  const { id } = router.query;

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      try {
        const decodedEntries = JSON.parse(atob(id)) as Entry[];
        setEntries(decodedEntries);
      } catch (error) {
        console.error('Error decoding shared diary:', error);
      }
    }
  }, [id]);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-gray-100">
      <h1 className="text-4xl font-bold mb-8">Shared Emotion Diary</h1>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <p className="font-bold">{entry.date}</p>
            <p className="text-xl" style={{ color: entry.emotion.color }}>{entry.emotion.name}</p>
            <p>{entry.entry}</p>
          </div>
        ))}
      </div>
    </div>
  )
}