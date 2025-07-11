'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../../../lib/api';

interface Progress { topic: string; percent: number; }

export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState<Progress[]>([]);
  useEffect(() => {
    if (!id) return;
    API.get<{ stats: Progress[] }>(`/progress?studentId=${id}`).then(r => setData(r.data.stats));
  }, [id]);
  const exp = () => window.open(`${API.defaults.baseURL}/export/${id}`);
  if (!data.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-blue-200 text-center">
        <p className="text-blue-700">Cargando...</p>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="p-6 max-w-lg w-full mx-auto bg-white rounded-2xl shadow-xl border border-blue-200">
        <Link href="/students" className="px-3 py-1 text-blue-600 underline mb-4 inline-block">Estudiantes</Link>
        <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">Progreso del estudiante</h1>
        <button
          onClick={exp}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6 w-full font-semibold transition"
        >
          Exportar CSV
        </button>
        <ul className="list-disc pl-5 space-y-2">
          {data.map(d => (
            <li key={d.topic} className="flex justify-between items-center bg-blue-50 rounded px-3 py-2">
              <span className="font-medium text-blue-700">{d.topic}</span>
              <span className="font-bold text-green-600">{d.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}